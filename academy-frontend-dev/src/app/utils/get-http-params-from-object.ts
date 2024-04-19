import {HttpParams} from '@angular/common/http';
import {QuestionQueryParams} from 'src/app/common/models/question.model';

interface ConvertedObject {
  [key: string]: string | string[] | number;
}

let previousParamsObject: ConvertedObject = {};
let previousParamsString: string = '';

export function getHttpParamsFromObject(
  query: QuestionQueryParams | null,
  usePrevParams: boolean,
  page: number,
  limit: number
): HttpParams | undefined {
  const filteredObject: ConvertedObject = {};
  let params: HttpParams;
  let paramsObject: ConvertedObject;

  if (usePrevParams) {
    [params, paramsObject] = generateParams(filteredObject, previousParamsObject, page, limit);

    updatePrevParams(params, paramsObject);
    return params;
  }

  if (query)
    Object.entries(query).forEach(([key, value]) => {
      if (key === 'title')
        if (value)
          filteredObject[key] = (value as string)
            .trim()
            .split(/[\s,\t\n]+/)
            .join(' ');
        else deletePropertyByKey(key);
      else if (value) filteredObject[key] = value;
      else deletePropertyByKey(key);
    });
  else if (!query && !usePrevParams) resetPrevParams();

  [params, paramsObject] = generateParams(filteredObject, previousParamsObject, page, limit);

  if (previousParamsString === params.toString()) return undefined;

  updatePrevParams(params, paramsObject);

  return params;
}

function deletePropertyByKey(key: string) {
  if (previousParamsObject[key]) delete previousParamsObject[key];
}

function generateParams(
  filteredObject: ConvertedObject,
  previousParamsObject: ConvertedObject,
  page: number,
  limit: number
): [HttpParams, ConvertedObject] {
  filteredObject['page'] = page;
  filteredObject['limit'] = limit;

  const paramsObject = {...previousParamsObject, ...filteredObject};

  return [new HttpParams({fromObject: paramsObject}), paramsObject];
}

function updatePrevParams(params: HttpParams, paramsObject: ConvertedObject): void {
  previousParamsString = params.toString();
  previousParamsObject = {...paramsObject};
}

function resetPrevParams(): void {
  previousParamsObject = {};
  previousParamsString = '';
}
