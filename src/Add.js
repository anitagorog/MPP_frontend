import React from 'react';

const Add = ({ FillName, FillAge, handleAddPerson, newName, newAge }) => {
    return (
        <div>
            <header>Adding</header>
            <label>
                Name: <input value={newName} onChange={FillName} />
            </label>
            <br></br>
            <label>
                Age: <input value={newAge} onChange={FillAge} />
            </label>
            <br></br>
            <button onClick={handleAddPerson}>Add</button>
        </div>
    );
}

export default Add;
