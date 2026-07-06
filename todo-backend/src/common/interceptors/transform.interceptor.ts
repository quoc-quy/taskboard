import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseEnvelope<T> {
  success: boolean;
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseEnvelope<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const http = context.switchToHttp();
    const response = http.getResponse();

    return next.handle().pipe(
      map((data) => {
        // REST COMPLIANCE: If the response is HTTP 204 No Content, return raw data (undefined) without
        // wrapping it in a JSON envelope. Under RFC 7231, an HTTP 204 response must not contain any body.
        if (response.statusCode === HttpStatus.NO_CONTENT || data === undefined) {
          return data;
        }

        // If response is already paginated (has data and meta properties)
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'meta' in data
        ) {
          return {
            success: true,
            data: data.data,
            meta: data.meta,
          };
        }

        // Standard response wrapping
        return {
          success: true,
          data,
        };
      }),
    );
  }
}
