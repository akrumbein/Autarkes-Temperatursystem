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
      <h3 style={{width:150}}>{title}</h3>
      <div
        style={{
          paddingLeft: 20,
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          gap: 20,
        }}
      >
        {values.map((ele) => (
          <h5>{ele}</h5>
        ))}
      </div>
    </div>
  );
};

export default Table;
