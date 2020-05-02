const puppeteer = require('puppeteer');
const prompts = require('prompts');

const scrapeImage = async (username, modeSelect) => {
  const browser = await puppeteer.launch({
    headless: modeSelect,
  });
  const page = await browser.newPage();

  await page.goto(`https://www.instagram.com/${username}/`);

  console.log('画像情報を取得中です........');

  await page.waitForSelector('img', {
    visible: true,
  });

  await page.screenshot({ path: `screenshot-${username}.png`, fullPage: true });

  console.log('スナップショットを撮影しました！');

  const data = await page.evaluate(() => {
    const images = document.querySelectorAll('img');
    const urls = Array.from(images).map(v => v.src);

    return urls;
  });

  await browser.close();

  console.log('終了しました');
  console.log(data);

  return data;
};

const getUsername = async () => {
  // const response = await prompts({
  //   type: 'text',
  //   name: 'username',
  //   message: 'ユーザー名を入力してください　',
  // });

  const response = await prompts([
    {
      type: 'select',
      name: 'selectMode',
      message: 'ヘッドレスモードを有効にしますか？',
      choices: [
        {
          title: '有効',
          description: 'ブラウザを立ち上げずに実行します',
          value: true,
        },
        {
          title: '無効',
          description: 'ブラウザを立ち上げて実行します',
          value: false,
        },
      ],
      initial: 0,
    },
    {
      type: 'text',
      name: 'username',
      message: 'ユーザー名を入力してください　',
    },
  ]);

  const { username, selectMode } = response;

  !username
    ? console.error('ユーザーネームの入力が必要です！')
    : scrapeImage(username, selectMode);
};

getUsername();
