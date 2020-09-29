import https from 'https';
import { Observable, of } from 'rxjs';
import { retryWhen, delay, tap, switchMap, take } from 'rxjs/operators';
import _ from 'lodash';

const agent = new https.Agent({
  keepAlive: true,
  maxSockets: 10,
});

export default class LimitRequest {
  private counter = 0;

  get(url: string) {
    const request = new Observable<string>(subscriber => {
      https
        .get(url, { agent }, res => {
          let data = '';

          res.on('data', chunk => {
            data += chunk;
          });

          res.on('end', () => {
            if (res.statusCode !== 200) {
              return subscriber.error(new Error('429 Too Many Requests'));
            }

            subscriber.next(data);
            subscriber.complete();
          });
        })
        .on('error', err => subscriber.error(err));
    });

    return of(null)
      .pipe(
        delay(_.random(1, 10) * 1000),
        tap(() => console.log(++this.counter, url)),
        switchMap(() => request),
        retryWhen(errors =>
          errors.pipe(
            tap(() => {
              console.log('Too many requests. Retrying after a minute...');
            }),
            delay(_.random(60, 120) * 1000),
            tap(() => console.log('Trying again...')),
            take(3),
          ),
        ),
      )
      .toPromise();
  }
}
