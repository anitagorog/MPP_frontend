import React from 'react';

const Update = ({ FillIdUpdate, FillNameUpdate, FillAgeUpdate, handleUpdatePerson, idToUpdate, newNameUpdate, newAgeUpdate }) => {
    return (
        <div>
            <header>Updating</header>
            <label>
                Id to the one to update: <input value={idToUpdate} onChange={FillIdUpdate} />
            </label>
            <br></br>
            <label>
                New name: <input value={newNameUpdate} onChange={FillNameUpdate} />
            </label>
            <br></br>
            <label>
                New age: <input value={newAgeUpdate} onChange={FillAgeUpdate} />
            </label>
            <br></br>
            <button onClick={handleUpdatePerson}>Update</button>
        </div>
    );
}

export default Update;
