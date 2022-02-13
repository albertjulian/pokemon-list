import React, { FunctionComponent, useState } from 'react';
import './App.css';
import TableComponent from './components/table';
import DetailComponent from './components/detail';
import { Button } from '@material-ui/core';

const App: FunctionComponent = () => {
  const [trigger, setTrigger] = useState('Pokemon List');
  const [urlDetail, setUrlDetail] = useState('');
  const [favorite, setFavorite] = useState(false);

  const handleDetail = (paramUrl?: string, pageName?: string) => {
    if (paramUrl) {
      setUrlDetail(paramUrl);
    }

    setTrigger(pageName || '');

    if (pageName?.includes('Pokemon List')) {
      setFavorite(pageName?.includes('My') ? true : false);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {trigger}
      </header>

      {
        trigger.includes('Pokemon List') ?
          (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleDetail('', favorite ? 'Pokemon List' : 'My Pokemon List')}
                style={{ marginBottom: 20 }}
              >
                {favorite ? 'Show All Pokemon List' : 'Show My Pokemon List'}
              </Button>
              <TableComponent favorite={favorite} handleDetail={handleDetail} />
            </>
          )
          :
          (
            <DetailComponent favorite={favorite} urlDetail={urlDetail} handleDetail={handleDetail} />
          )
      }
    </div>
  );
}

export default App;
