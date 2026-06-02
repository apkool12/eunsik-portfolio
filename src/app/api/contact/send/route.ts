import { Buffer } from "node:buffer";
import tls from "node:tls";

export const runtime = "nodejs";

const SMTP_HOST = "smtp.naver.com";
const SMTP_PORT = 465;
const MAIL_TO = "apkool12@naver.com";

type ContactPayload = {
  title?: unknown;
  email?: unknown;
  content?: unknown;
};

type MailMessage = {
  subject: string;
  replyTo: string;
  content: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function encodeHeader(value: string) {
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function sanitizeHeader(value: string) {
  return value.replace(/[\r\n]/g, " ").trim();
}

function dotStuff(value: string) {
  return value.replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..");
}

function createMessage({ subject, replyTo, content }: MailMessage, from: string) {
  const safeSubject = sanitizeHeader(subject);
  const safeReplyTo = sanitizeHeader(replyTo);
  const body = [
    "포트폴리오 Contact 페이지에서 새 메일이 도착했습니다.",
    "",
    `보낸 이메일: ${safeReplyTo}`,
    `제목: ${safeSubject}`,
    "",
    "내용",
    "----",
    content,
  ].join("\r\n");

  return [
    `From: ${encodeHeader("Eunsik Portfolio")} <${from}>`,
    `To: <${MAIL_TO}>`,
    `Reply-To: <${safeReplyTo}>`,
    `Subject: ${encodeHeader(`[Portfolio] ${safeSubject}`)}`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    dotStuff(body),
  ].join("\r\n");
}

function waitForResponse(socket: tls.TLSSocket) {
  return new Promise<string>((resolve, reject) => {
    let buffer = "";

    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const onData = (chunk: Buffer) => {
      buffer += chunk.toString("utf8");
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      const lastLine = lines.at(-1);

      if (lastLine && /^\d{3} /.test(lastLine)) {
        cleanup();
        resolve(buffer);
      }
    };

    socket.on("data", onData);
    socket.on("error", onError);
  });
}

async function sendCommand(socket: tls.TLSSocket, command: string, expected: number[]) {
  socket.write(`${command}\r\n`);
  const response = await waitForResponse(socket);
  const code = Number(response.slice(0, 3));

  if (!expected.includes(code)) {
    throw new Error(`SMTP command failed: ${code}`);
  }

  return response;
}

async function sendMail(message: MailMessage) {
  const user = process.env.NAVER_SMTP_USER;
  const password = process.env.NAVER_SMTP_APP_PASSWORD;

  if (!user || !password) {
    throw new Error("SMTP credentials are missing");
  }

  const socket = tls.connect({
    host: SMTP_HOST,
    port: SMTP_PORT,
    servername: SMTP_HOST,
  });

  socket.setTimeout(12000);

  try {
    await new Promise<void>((resolve, reject) => {
      socket.once("secureConnect", resolve);
      socket.once("error", reject);
      socket.once("timeout", () => reject(new Error("SMTP connection timeout")));
    });

    const greeting = await waitForResponse(socket);
    if (!greeting.startsWith("220")) throw new Error("SMTP greeting failed");

    await sendCommand(socket, "EHLO eunsik-portfolio.local", [250]);
    await sendCommand(socket, "AUTH LOGIN", [334]);
    await sendCommand(socket, Buffer.from(user).toString("base64"), [334]);
    await sendCommand(socket, Buffer.from(password).toString("base64"), [235]);
    await sendCommand(socket, `MAIL FROM:<${user}>`, [250]);
    await sendCommand(socket, `RCPT TO:<${MAIL_TO}>`, [250, 251]);
    await sendCommand(socket, "DATA", [354]);

    socket.write(`${createMessage(message, user)}\r\n.\r\n`);
    const dataResponse = await waitForResponse(socket);
    const dataCode = Number(dataResponse.slice(0, 3));
    if (dataCode !== 250) throw new Error(`SMTP data failed: ${dataCode}`);

    await sendCommand(socket, "QUIT", [221]);
  } finally {
    socket.end();
  }
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return Response.json({ message: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const subject = normalizeText(payload.title, 120);
  const replyTo = normalizeText(payload.email, 160);
  const content = normalizeText(payload.content, 5000);

  if (!subject || !replyTo || !content) {
    return Response.json({ message: "모든 항목을 입력해주세요." }, { status: 400 });
  }

  if (!isValidEmail(replyTo)) {
    return Response.json({ message: "이메일 형식이 올바르지 않습니다." }, { status: 400 });
  }

  try {
    await sendMail({ subject, replyTo, content });
    return Response.json({ message: "메일을 보냈습니다." });
  } catch (error) {
    console.error("Contact mail failed", error);
    return Response.json(
      { message: "메일 전송에 실패했습니다. SMTP 설정을 확인해주세요." },
      { status: 500 }
    );
  }
}
