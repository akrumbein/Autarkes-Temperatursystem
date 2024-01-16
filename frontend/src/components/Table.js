const Table = ({ title, values }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        borderTopLeftRadius: 40,
        borderBottomLeftRadius: 40,
        backgroundColor: "#fff",
        paddingLeft: 25,
        marginLeft: 10,
        justifyItems: "center",
      }}
    >
      <h3 style={{ width: 540, display: "flex" }}>{title}</h3>
      <div
        style={{
          paddingLeft: 20,
          marginRight: 20,
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          alignItems:"center",
          gap: 20,
        }}
      >
        {values}
      </div>
    </div>
  );
};

export default Table;
