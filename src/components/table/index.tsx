import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import getUserData from '../../services/user';
import EnhancedTable from './table';

interface PropTypes {
  favorite?: boolean;
  handleDetail: (urlParams: string, pageName: string) => void;
}

const initialUrl = 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0';

const TableComponent: React.FC<PropTypes> = (
  props: PropTypes,
) => {
  const {
    favorite,
    handleDetail,
  } = props;
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [url, setUrl] = useState(initialUrl);
  const [nextUrl, setNextUrl] = useState(initialUrl);
  const [prevUrl, setPrevUrl] = useState(initialUrl);
  const dataStorage: any = localStorage.getItem('pokemon');

  const handleChangePage = (oldPage: number, newPage: number) => {
    if (newPage === 0) {
      setUrl(initialUrl);
    } else if (newPage > oldPage) {
      setUrl(nextUrl);
    } else if (newPage < oldPage) {
      setUrl(prevUrl);
    }
  }

  const getUserDataFunction = async () => {
    try {
      const dataObjectStorage = JSON.parse(dataStorage);

      getUserData(url || initialUrl).then((response: any) => {
        const newResponse = response && response.results && response.results.map((row: any) => {
          return {
            name: row.name.toUpperCase(),
            owned: (dataObjectStorage && dataObjectStorage[row.name] && dataObjectStorage[row.name].owned) || 0,
            action: (
              <Button
                style={{ maxWidth: '150px' }}
                variant="contained"
                color="primary"
                onClick={() => handleDetail(row.url, `Pokemon ${row.name.toUpperCase()} Detail`)}
                fullWidth
              >
                Detail
              </Button>
            ),
          }
        });
        setNextUrl(response.next);
        setPrevUrl(response.previous);
        setTotalRows(response && response.count);
        setData(newResponse);
      });
    } catch (err) {
      throw err;
    }
  }

  const getDataLocalStorage = async () => {
    if (dataStorage) {
      const objectStorage = JSON.parse(dataStorage);

      const newData: any = Object.keys(objectStorage).map((keyIndex: string) => {
        return {
          name: objectStorage[keyIndex].name.toUpperCase(),
          owned: objectStorage[keyIndex].owned,
          action: (
            <Button
              style={{ maxWidth: '150px' }}
              variant="contained"
              color="primary"
              onClick={() => handleDetail(objectStorage[keyIndex].url, `Pokemon ${objectStorage[keyIndex].name.toUpperCase()} Detail`)}
              fullWidth
            >
              Detail
            </Button>
          ),
        }
      });

      setData(newData);
      setTotalRows(newData.length);
    }
  }

  useEffect(() => {
    const ac = new AbortController();

    if (favorite) {
      getDataLocalStorage()
    } else {
      getUserDataFunction();
    }

    return () => ac.abort();
  }, [favorite]);

  return (
    <EnhancedTable
      data={data}
      callback={handleChangePage}
      totalRows={totalRows}
    />
  );
}

export default React.memo(TableComponent);