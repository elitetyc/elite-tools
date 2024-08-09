import * as crypto from 'crypto';
class Util{
  public static md5Encode(str: string): string {
    return  crypto.createHash('md5').update(str).digest('hex')
  }
}

export default Util
