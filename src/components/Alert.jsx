export default function Alert({ message, type = "success" }) {
  const styles = {
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: type === "success" ? "#22c55e" : "#ef4444",
    color: "white",
  };

  return <div style={styles}>{message}</div>;
}
