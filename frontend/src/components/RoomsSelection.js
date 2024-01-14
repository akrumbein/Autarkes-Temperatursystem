const RoomsSelection = ({
  setChoosenRoom,
  currentActiveRoom,
  choosenRoom,
  availableRooms,
}) => {
  return (
    <select
      value={choosenRoom}
      onChange={(e) => setChoosenRoom(e.target.value)}
      style={{
        width: "fit-content",
      }}
    >
      {availableRooms.map((ele) => (
        <option key={ele} value={ele}>
          {ele} {ele == currentActiveRoom && "(Aktiv)"}
        </option>
      ))}
    </select>
  );
};

export default RoomsSelection;
