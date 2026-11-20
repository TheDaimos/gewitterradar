import {writeFile as write} from 'node:fs/promises';
// Windows scanners can briefly retain just-written release files. Retry only
// transient sharing/access errors; persistent failures still abort the build.
export async function writeFile(...args){
 for(let attempt=0;;attempt++)try{return await write(...args);}catch(error){
  if(attempt>=9||!['UNKNOWN','EBUSY','EPERM','EACCES'].includes(error.code))throw error;
  await new Promise(resolve=>setTimeout(resolve,50*(attempt+1)));
 }
}
