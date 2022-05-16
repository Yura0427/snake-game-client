import React, { useEffect, useState } from 'react';
import { createCandidate } from './api';
import Modal from './Modal/Modal';
import { useInterval } from './useInterval';



function Game({ setName, setStart, setRecords, name, records }) {
    const [COUNT, setCOUNT] = useState(0);
    const [snakeSpeed, setSnakeSpeed] = useState(500);
    const [PAUSE, setPAUSE] = useState(false);

    const FIELD_SIZE = 18

    const [snakeSegments, setSnakeSegments] = useState([
        { x: 1, y: 0 },
        { x: 0, y: 0 },
    ]);
    const [head, ...tail] = snakeSegments;
    const getRandomCoordinates = () => {
        const x = Math.floor(Math.random() * FIELD_SIZE)
        const y = Math.floor(Math.random() * FIELD_SIZE)
        if (head.x === x && head.y === y) {
            return getRandomCoordinates()
        }
        return { x, y }
    }
    const DIRECTION = {
        RIGHT: { x: 1, y: 0 },
        LEFT: { x: -1, y: 0 },
        TOP: { x: 0, y: -1 },
        BOTTOM: { x: 0, y: 1 }
    };
    const FILD_ROW = [...new Array(FIELD_SIZE).keys()]
    const [direction, setDirection] = useState(DIRECTION.RIGHT);
    let foodType = () => {
        const x = Math.floor(Math.random() * 10)
        if (x === 0) return '🍎'
        if (x > 0 && x < 4) return '🍐'
        if (x >= 4) return '🍒'
    }
    let [foodItem, setFoodItem] = useState({
        coordinates: getRandomCoordinates(),
        type: foodType()
    });

    const limitByField = x => {
        if (x >= FIELD_SIZE) return 0;
        if (x < 0) return FIELD_SIZE - 1;
        return x;
    };

    const getItem = (x, y, snakeDots) => {
        if (foodItem.coordinates.x === x && foodItem.coordinates.y === y) {
            return <div>{foodItem.type}</div>
        }
        const [head, ...tail] = snakeDots;
        if (head.x === x && head.y === y) {
            return <div>🔳</div>
        }
        for (const segment of tail) {
            if (segment.x === x && segment.y === y) {
                return <div>■</div>
            }
        }
    }

    const onKeyDown = (e) => {
        e = e || window.event;
        switch (e.keyCode) {
            case 32:
                setPAUSE(PAUSE => !PAUSE)
                break;
            case 38:
                setDirection(DIRECTION.TOP);
                break;
            case 40:
                setDirection(DIRECTION.BOTTOM);
                break;
            case 37:
                setDirection(DIRECTION.LEFT);
                break;
            case 39:
                setDirection(DIRECTION.RIGHT);
                break;
        }
    }

    const intersectsWithItself = tail.some(
        segment => segment.x === head.x && segment.y === head.y
    );

    function collidesWithFood(head, foodItem) {
        return (foodItem.coordinates.x === head.x && foodItem.coordinates.y === head.y)
    }

    function newSnakePosition(segments, direction) {
        const [head] = segments;
        const newHead = {
            x: limitByField(head.x + direction.x),
            y: limitByField(head.y + direction.y)
        };
        if (collidesWithFood(newHead, foodItem)) {
            foodItem.type === '🍎' ?
                setCOUNT(COUNT + 10) : foodItem.type === '🍐' ?
                    setCOUNT(COUNT + 5) : setCOUNT(COUNT + 1)
            setSnakeSpeed(snakeSpeed => snakeSpeed * 0.95)
            setFoodItem({
                coordinates: getRandomCoordinates(),
                type: foodType()
            })
            return [newHead, ...segments];
        } else {
            return [newHead, ...segments.slice(0, -1)];
        }
    }

    const end = () => {
        const candidate = { name, points: COUNT }
        setRecords([...records, candidate])
        setStart(false)
        setName('')
        createCandidate(candidate)
    }

    useEffect(() => {
        document.onkeydown = onKeyDown
    }, [])

    useInterval(() => {
        setSnakeSegments(segments => newSnakePosition(segments, direction));
    }, intersectsWithItself || PAUSE ? null : snakeSpeed);

    return (
        <>
            <div className="game-area">
                <div>COUNT = {COUNT}</div>
                <div style={{ display: 'flex', flexDirection: 'column' }} >
                    {
                        FILD_ROW.map(y => (<div key={y} style={{ display: 'flex' }}>
                            {
                                FILD_ROW.map(x =>
                                (<div key={x} className="game-box">
                                    {getItem(x, y, snakeSegments)}
                                </div>)
                                )
                            }
                        </div>)
                        )
                    }
                </div>
                <div>Types of feed: 🍎-10 point, 🍐-5 point, 🍒-1 point </div>
                <div>Controls: 🡒, 🡐, 🡑, 🡓, space - pause </div>
            </div>
            <Modal active={PAUSE || intersectsWithItself}  >
                <>
                    {
                        PAUSE ? 'PAUSE' : intersectsWithItself ?
                            'GAME OVER' : null
                    }
                    {
                        intersectsWithItself ?
                            <input
                                onClick={end}
                                style={{ display: 'block', margin: '5px auto', }}
                                type='button'
                                value='OK'
                            /> : null
                    }
                </>
            </Modal>
        </>
    );

}

export default Game;
