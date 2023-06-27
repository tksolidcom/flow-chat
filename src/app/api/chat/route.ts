import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import Channels from 'pusher';

const { app_id, key, secret, cluster } = process.env;

const channels = new Channels({
  appId: app_id!,
  key: key!,
  secret: secret!,
  cluster: cluster!,
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (100 < data.chatContent.length) {
      return NextResponse.json(
        { result: false, error: '100文字以上です' },
        { status: 400 }
      );
    }
    await channels.trigger(data.channel, 'chat', data.chatContent);
    return NextResponse.json({ message: 'success', req: { ...data } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ result: false, error: error }, { status: 400 });
  }
}
