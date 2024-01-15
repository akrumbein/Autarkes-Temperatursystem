const RoomsSelection = ({
  setChoosenRoom,
  currentActiveRoom,
  choosenRoom,
  availableRooms,
}) => {
  return (
    <div style={{ fontSize: 17, fontWeight: 500, color: "white" }}>
      <>Raum: </>
      <select
        value={choosenRoom}
        onChange={(e) => setChoosenRoom(e.target.value)}
        style={{
          width: "fit-content",
          fontSize: 17,
          fontWeight: 500,
          marginLeft: 10,
          padding: 5,
          borderRadius: 10,
        }}
      >
        {availableRooms.map((ele) => (
          <option key={ele} value={ele}>
            {ele} {ele == currentActiveRoom && "(Aktiv)"}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoomsSelection;
