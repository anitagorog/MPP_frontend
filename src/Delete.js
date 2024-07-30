import React from 'react';

const Delete = ({ FillId, handleDeletePerson, idToDelete }) => {
    return (
        <div>
            <header>Deleting</header>
            <label>
                Id: <input value={idToDelete} onChange={FillId} />
            </label>
            <br></br>
            <button onClick={handleDeletePerson}>Delete</button>
        </div>
    );
}

export default Delete;
