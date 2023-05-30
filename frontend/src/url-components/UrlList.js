import React, { useState } from 'react';
import TopModal from '../modal-components/TopModal';
import axios from 'axios'

function UrlList() {
  const [urls, setUrls] = useState([]);
  const [showList, setShowList] = useState(false);
  const [message, setMessage] = useState('')

  const handleShowList = async() => {
    setMessage('')
    if (!showList) {
      setMessage('Waiting...')
      await axios.get(process.env.REACT_APP_ALL)
        .then(result => {
          setMessage('')
          setUrls(result.data)
          setShowList(!showList);
        })
        .catch(err => setMessage(err.response.data.msg))
    } else {
      setShowList(!showList);
    }
  };

  const handleCloseModal = () => {
    setMessage('');
  };

  return (
    <div className='container'>
      <button className='show-list' onClick={handleShowList}>
        {showList ? 'Hide Urls' : 'Show My Urls'}
      </button>
      <div className='table-container'>
      {showList && (
        <div>
          {urls.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>URL</th>
                    <th>Short URL</th>
                    <th>Visits</th>
                  </tr>
                </thead>
                <tbody>
                  {urls.map((url, index) => (
                    <tr key={index}>
                      <td>
                        <a href={url.origUrl}>
                          {url.origUrl}
                        </a>
                      </td>
                      <td>
                        <a href={url.shortUrl} >
                          {url.shortUrl}
                        </a>
                      </td>
                      <td>{url.clicks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          ) : (
            <div className='c-pill c-pill--warning'>No URLs available</div>
          )}
        </div>
      )}
      </div>
      {message && (
            <div>
              <TopModal onClose={handleCloseModal}>
                <p>{message}</p>
              </TopModal>
            </div>
      )}
    </div>
  );
}

export default UrlList;
