import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
const key = 'storage/mail-auth/kraus-graph-private-v2.pem';
const cert = 'storage/mail-auth/kraus-graph-public-v2.crt';
if (existsSync(key) || existsSync(cert)) throw Error('Replacement files already exist; not overwriting');
const result = spawnSync('C:/Program Files/Git/usr/bin/openssl.exe', ['req','-x509','-newkey','rsa:3072','-sha256','-days','365','-nodes','-keyout',key,'-out',cert,'-subj','/CN=Kraus Papers Website Mail Replacement'], { stdio: 'ignore', timeout: 20000 });
if (result.status !== 0) throw Error('Replacement certificate generation failed');
console.log('Replacement certificate generated privately. No key values displayed.');
