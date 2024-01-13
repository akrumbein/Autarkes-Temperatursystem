const HeaderButtons = ({label, onClick}) =>{
    return (
        <button onClick={onClick} style={{
            border: "1px solid #0077CC",
            borderRadius:4,
            padding:10,
            fontSize: 17,
            fontWeight: 400,
            backgroundImage:"linear-gradient(#42A1EC, #0070C9)",
            color:"#ffffff"
        }}>
            {label}
        </button>
    )
}

export default HeaderButtons