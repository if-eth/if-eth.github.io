import * as React from 'react';
import ApiKeyItem from './ApiKeyItem';
import { EthercastTypes } from '@ethercast/model';
import { Card } from 'semantic-ui-react';

interface Props {
  items: EthercastTypes.ApiKey[];
  deleteApiKey: (id: string) => void;
}

export default ({ items, deleteApiKey }: Props) => {
  return (
    <Card.Group itemsPerRow={1} stackable>
      {
        items.map(
          (apiKey: EthercastTypes.ApiKey) => (
            <ApiKeyItem key={apiKey.id} apiKey={apiKey} deleteApiKey={deleteApiKey}/>
          )
        )
      }
    </Card.Group>
  );
}
