import { Button, Snackbar } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import getUserData from '../../services/user';
import './index.css';

interface PropTypes {
  favorite?: boolean;
  urlDetail: string;
  handleDetail: (urlParams?: string, pageName?: string) => void;
}

const mainColor: any = {
  fire: '#8B0000',
  grass: '#006400',
  water: '#00008B',
  bug: '#ADFF2F',
  normal: '#A9A9A9',
  flying: '#6A5ACD',
  poison: '#8B008B',
  electric: '#FFA500',
  ground: '#8B4513',
  steel: '#708090',
  fairy: '#FF00FF',
  psychic: '#DB7093',
  dragon: '#191970',
  ghost: '#663399',
  dark: '#1a1a1a',
  fighting: '#A0522D',
  ice: '#87CEEB',
  rock: '#F4A460',
  white: '#FFF8DC',
}

interface iData {
  sprites?: any;
  name?: any;
  image?: string;
  weight?: number;
  height?: number;
  moves?: any;
  types?: any;
  id?: number;
  url?: string;
}

const initialData: iData = {}

const DetailComponent: React.FC<PropTypes> = (
  props: PropTypes,
) => {
  const {
    favorite,
    urlDetail,
    handleDetail,
  } = props;
  const [data, setData] = useState(initialData);
  const [mainAttribute, setMainAttribute] = useState('white');
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState('');

  const getUserDataFunction = async () => {
    try {
      getUserData(urlDetail).then((response: iData) => {
        const newData = {
          id: response.id,
          url: urlDetail,
          name: response.name,
          sprites: response.sprites,
          weight: response.weight,
          height: response.height,
          moves: response.moves.map((row: any) => row.move.name).join(', '),
          types: response.types.map((row: any, index: number) => {
            if (index === 0) {
              setMainAttribute(row.type.name);
            }
            return row.type.name
          }).join(', '),
          image:
            response && response.sprites && response.sprites.other &&
            response.sprites.other.dream_world && response.sprites.other.dream_world.front_default,
        }
        setData(newData);
      });
    } catch (err) {
      throw err;
    }
  }

  const handleCatch = () => {
    const probsSuccess = Math.floor(Math.random() * 100) % 2 === 0;
    if (probsSuccess) {
      const dataStorage: any = localStorage.getItem('pokemon');
      const dataObjectStorage = dataStorage && JSON.parse(dataStorage);

      if (dataObjectStorage) {
        if (dataObjectStorage[data.name]) {
          dataObjectStorage[data.name].owned += 1;
          localStorage.setItem('pokemon', JSON.stringify(dataObjectStorage));
        } else {
          const newData: any = {
            ...dataObjectStorage,
            [data.name]: {
              url: data.url,
              name: data.name,
              owned: 1,
            },
          };

          localStorage.setItem('pokemon', JSON.stringify(newData));
        }
      } else {
        const newData: any = {
          [data.name]: {
            url: data.url,
            name: data.name,
            owned: 1,
          },
        };
        localStorage.setItem('pokemon', JSON.stringify(newData));
      }
      setMessage('Success');
    } else {
      setMessage('Failed')
    }

    setOpenModal(true);
  }

  const handleClose = () => { setOpenModal(false) }

  useEffect(() => {
    const ac = new AbortController();

    getUserDataFunction();

    return () => ac.abort();
  }, []);

  return (
    <div className='root'>
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openModal}
        onClose={handleClose}
        key="top-center"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            minWidth: '220px',
            borderRadius: 10,
            padding: 20,
            backgroundColor: message && message === 'Success' ? 'green' : 'red',
            color: 'white',
          }}
        >
          {
            message && message === 'Success' ?
              <CheckCircleIcon />
              :
              <CancelIcon />
          }
          <p>{`${message} to catch ${data.name}`}</p>
        </div>
      </Snackbar>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCatch}
        style={{ marginBottom: 20 }}
      >
        Catch
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleDetail('', favorite ? 'My Pokemon List' : 'Pokemon List')}
        style={{ marginBottom: 20 }}
      >
        Back
      </Button>
      <div className='pokemon-card' style={{ backgroundColor: mainColor[mainAttribute] }}>
        {
          data && data.image &&
          (
            <div className='pokemon-card-image'>
              <img className='pokemon-image' src={data.sprites.other.dream_world.front_default} alt={data.name} />
            </div>
          )
        }

        <div className='pokemon-card-description'>
          <div className='pokemon-description-detail'>
            <div className='pokemon-description-title'>Name</div>
            <div className='pokemon-description-value'>{data.name?.toUpperCase()}</div>
          </div>

          <div className='pokemon-description-detail'>
            <div className='pokemon-description-title'>Height</div>
            <div className='pokemon-description-value'>{data.height}</div>
          </div>

          <div className='pokemon-description-detail'>
            <div className='pokemon-description-title'>Weight</div>
            <div className='pokemon-description-value'>{data.weight}</div>
          </div>

          <div className='pokemon-description-detail'>
            <div className='pokemon-description-title'>Types</div>
            <div className='pokemon-description-value'>{data.types?.toUpperCase()}</div>
          </div>

          <div className='pokemon-description-detail'>
            <div className='pokemon-description-title'>Moves</div>
            <div className='pokemon-description-value'>{data.moves?.toUpperCase()}</div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default React.memo(DetailComponent);