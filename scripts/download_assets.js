const fs = require('fs');
const path = require('path');
const http = require('http');

const assets = [
  {
    url: 'http://localhost:3845/assets/5dc1e2fcc3f3174dc0070e512d9ef9d0dba823e4.svg',
    dest: 'src/assets/icons/bullet.svg',
  },
  {
    url: 'http://localhost:3845/assets/fec8e56c84ffc2acc70db110d2b735317d1dccc2.svg',
    dest: 'src/assets/icons/chevron-right.svg',
  },
  {
    url: 'http://localhost:3845/assets/8814f3240411cf3e30934f16eb9bcd2fefe5d3ef.svg',
    dest: 'src/assets/icons/trash.svg',
  },
  {
    url: 'http://localhost:3845/assets/849e31550569cb8d9e0982c39ed2985326b8f738.png',
    dest: 'src/assets/images/avatar-noura.png',
  },
  {
    url: 'http://localhost:3845/assets/634225dfaace9427a6a09264b689b827466df0c4.svg',
    dest: 'src/assets/icons/leaf.svg',
  },
  {
    url: 'http://localhost:3845/assets/534136f11292726e057d42c2dee67699ef41d8a0.svg',
    dest: 'src/assets/icons/edit-pencil.svg',
  },
  {
    url: 'http://localhost:3845/assets/bd22c5b81a6822d11f41132b78796a62967b6b73.svg',
    dest: 'src/assets/icons/pantry.svg',
  },
  {
    url: 'http://localhost:3845/assets/807221706da4bf27acc08d15c41244e80ca70d8e.svg',
    dest: 'src/assets/icons/chef-hat.svg',
  },
  {
    url: 'http://localhost:3845/assets/770d294a2c781338de16046c6cd3ce77887c031c.svg',
    dest: 'src/assets/icons/wallet.svg',
  },
  {
    url: 'http://localhost:3845/assets/f75ae0679e9ad053ab82fb06257d565e76ff46c6.svg',
    dest: 'src/assets/icons/waste.svg',
  },
  {
    url: 'http://localhost:3845/assets/a7704540e978c2a083ca2c74dd71f4fa9d398673.svg',
    dest: 'src/assets/icons/household.svg',
  },
  {
    url: 'http://localhost:3845/assets/c4c5e3dad33e4ba1a3f431bf5e45e30b5de5de8d.svg',
    dest: 'src/assets/icons/chevron-right-thin.svg',
  },
  {
    url: 'http://localhost:3845/assets/910526d0e00e99aa0a0fd83ba15a1b38303b1f60.svg',
    dest: 'src/assets/icons/budget.svg',
  },
  {
    url: 'http://localhost:3845/assets/a27aef684ec8d908fa03b3f45b6f9b2e61f287ea.svg',
    dest: 'src/assets/icons/diet.svg',
  },
  {
    url: 'http://localhost:3845/assets/3114bdda2baf37068410cce8f8f990fc3d417cb4.svg',
    dest: 'src/assets/icons/bell.svg',
  },
  {
    url: 'http://localhost:3845/assets/2f77de4013e5be5ebc20f07bf330f2110b716e8e.svg',
    dest: 'src/assets/icons/globe.svg',
  },
  {
    url: 'http://localhost:3845/assets/d0461f94fcaa76c1da4e89a1625287db814f2ad1.svg',
    dest: 'src/assets/icons/moon.svg',
  },
  {
    url: 'http://localhost:3845/assets/17f37fb51086b36fdbf2ba25cf49492a2bc5035a.svg',
    dest: 'src/assets/icons/help.svg',
  },
  {
    url: 'http://localhost:3845/assets/6c59effb97ebc4fedf2e2f466be650e5aa14cba5.svg',
    dest: 'src/assets/icons/arrow-right-settings.svg',
  },
  {
    url: 'http://localhost:3845/assets/17334837774bfa6837576ddb0e31649064e86886.svg',
    dest: 'src/assets/icons/contact.svg',
  },
  {
    url: 'http://localhost:3845/assets/788a9e4be490590c86b9609d0ac2dffbf2254e8e.svg',
    dest: 'src/assets/icons/privacy.svg',
  },
  {
    url: 'http://localhost:3845/assets/a13aec72c9f83c15a9bb90332b29e42613928e2f.svg',
    dest: 'src/assets/icons/notification-badge.svg',
  },
  {
    url: 'http://localhost:3845/assets/61f3b8a0069d2c4090ea638cef3558d393ea751a.svg',
    dest: 'src/assets/icons/avatar-placeholder.svg',
  },
  {
    url: 'http://localhost:3845/assets/d0a9fc85b3b181904e6144c8f93f370dea75c1ef.svg',
    dest: 'src/assets/icons/nav-home.svg',
  },
  {
    url: 'http://localhost:3845/assets/3e66fd5a42a36168c1e3e4768ef88e0036d29ab5.svg',
    dest: 'src/assets/icons/nav-pantry.svg',
  },
  {
    url: 'http://localhost:3845/assets/b2edd2af1c5c0b01eaec4c36f6689cc54850e767.svg',
    dest: 'src/assets/icons/nav-meals.svg',
  },
  // Edit Profile specific assets
  {
    url: 'http://localhost:3845/assets/03fbdc9118e66fdeb9bdd6df3f090924c8faaa7c.svg',
    dest: 'src/assets/icons/save-icon.svg',
  },
  {
    url: 'http://localhost:3845/assets/67b5787183c647912f8b0f4bb8f8b64c6d7df4a4.svg',
    dest: 'src/assets/icons/cancel-icon.svg',
  },
  {
    url: 'http://localhost:3845/assets/d460434bf47fa3a809f4480e4a7c6621d1c21ffc.png',
    dest: 'src/assets/images/avatar-noura-large.png',
  },
  {
    url: 'http://localhost:3845/assets/95f29baf9b89a66d948eeb824c01d841ea1a850f.svg',
    dest: 'src/assets/icons/arrow-left.svg',
  },
  {
    url: 'http://localhost:3845/assets/19816c81b4a71618d50d1f48c9a42d33641a9f9d.svg',
    dest: 'src/assets/icons/camera.svg',
  },
  {
    url: 'http://localhost:3845/assets/ecda6d5b2e4b88fb06b3336634693f577a979bf6.svg',
    dest: 'src/assets/icons/profile-glow-edit.svg',
  },
  {
    url: 'http://localhost:3845/assets/054ca201354a43b043341c8c45c259171687c501.svg',
    dest: 'src/assets/icons/input-mail.svg',
  },
  {
    url: 'http://localhost:3845/assets/d42e5f69f87e2fa4111d69f3f773576341cf8ed6.svg',
    dest: 'src/assets/icons/input-phone.svg',
  },
  {
    url: 'http://localhost:3845/assets/cdd9c790fee8469cbf206079eb4630a3bf41bfe2.svg',
    dest: 'src/assets/icons/security-shield.svg',
  },
  {
    url: 'http://localhost:3845/assets/d27f2a08b65a70421764052bc7d308963973d06c.svg',
    dest: 'src/assets/icons/chevron-right-thick.svg',
  },
];

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    http
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
  });
}

async function main() {
  console.log('Downloading assets...');
  for (const asset of assets) {
    const fullDest = path.join(__dirname, '..', asset.dest);
    const dir = path.dirname(fullDest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    try {
      await download(asset.url, fullDest);
      console.log(`Success: ${asset.dest}`);
    } catch (err) {
      console.error(`Error downloading ${asset.url}:`, err.message);
    }
  }
  console.log('All downloads completed!');
}

main();
