import React, { useEffect, useState } from 'react';
import { fetchCandidate } from './api';
import Game from './Game';



function App() {
  const [loading, setLoading] = useState(true)

  const [records, setRecords] = useState([])
  const [name, setName] = useState('')
  const [start, setStart] = useState(false)
  const play = () => {
    if (name) {
      setStart(true)
    }
  }

  useEffect(() => {
    // async function fetchData() {
    //   const response = await fetchCandidate()
    //   console.log(response);
    // }
    // fetchData();
    fetchCandidate().then((res) => {
      setRecords(res);
      setLoading(false)
    })

  },[])

  useEffect(() => {
    console.log(records);
  }, [records])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
      {!start ?
        <>
          <input
            placeholder='Enter name'
            style={{ width: '50%' }}
            value={name}
            type='text'
            onChange={(e) => setName(e.target.value)}
          />
          <button
            disabled={!name}
            style={{ margin: 20 }}
            onClick={play}
          >
            Start game
          </button>
        </> :
        <Game setName={setName} setStart={setStart} setRecords={setRecords} name={name} records={records} />
      }
      {
        loading ? <div>loading...</div> :
          records.length ?
            <table>
              <thead>
                <tr>
                  <td>#</td>
                  <td>Name</td>
                  <td>Points</td>
                </tr>
              </thead>
              <tbody>
                {
                  records.sort((a, b) => (b.points - a.points)).map((el, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{el.name}</td>
                      <td>{el.points}</td>
                    </tr>))
                }
              </tbody>
            </table> : null
      }


    </div>

  );

}

export default App;
