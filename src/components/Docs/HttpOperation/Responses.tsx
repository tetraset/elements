import { IHttpOperationResponse } from '@stoplight/types';
import { Button, ButtonGroup, Icon } from '@stoplight/ui-kit';
import cn from 'classnames';
import * as React from 'react';

import { MarkdownViewer } from '../../MarkdownViewer';
import { SchemaViewer } from '../../SchemaViewer';
import { Parameters } from './Parameters';
import { getExamplesObject } from './utils';

export const HttpCodeColor = {
  1: 'gray',
  2: 'green',
  3: 'yellow',
  4: 'orange',
  5: 'red',
};

export interface IResponseProps {
  className?: string;
  response: IHttpOperationResponse;
}

export interface IResponsesProps {
  responses: IHttpOperationResponse[];
  className?: string;
}

export const Responses = ({ className, responses }: IResponsesProps) => {
  const [activeResponse, setActiveResponse] = React.useState(0);
  if (!responses || !responses.length) return null;

  const sortedResponses = [...responses].sort();

  return (
    <div className={cn('HttpOperation__Responses', className)}>
      <div className="flex items-center">
        <div className="text-lg font-semibold">Responses</div>
      </div>

      <ButtonGroup className="mt-6">
        {sortedResponses.map((response, index) => {
          if (!response.code) return null;

          return (
            <Button
              key={response.code}
              active={activeResponse === index}
              text={response.code}
              icon={<Icon icon="full-circle" iconSize={10} color={HttpCodeColor[String(response.code)[0]]} />}
              onClick={() => setActiveResponse(index)}
            />
          );
        })}
      </ButtonGroup>

      <Response className="mt-6" response={sortedResponses[activeResponse]} />
    </div>
  );
};
Responses.displayName = 'HttpOperation.Responses';

export const Response = ({ className, response }: IResponseProps) => {
  if (!response || typeof response !== 'object') return null;

  const examples = getExamplesObject(response.contents?.[0].examples || []);

  return (
    <div className={cn('HttpOperation__Response', className)}>
      {response.description && <MarkdownViewer className="mb-6" markdown={response.description} />}

      <Parameters className="mb-6" title="Headers" parameters={response.headers} />

      {response?.contents?.[0].schema && <SchemaViewer schema={response?.contents?.[0].schema} examples={examples} />}
    </div>
  );
};
Response.displayName = 'HttpOperation.Response';