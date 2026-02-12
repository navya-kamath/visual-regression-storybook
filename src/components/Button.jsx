export default function Button({ label, variant = "primary" }) {
  const styles = {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    backgroundColor: variant === "primary" ? "#4f46e5" : "#ef4444",
    color: "white",
  };

  return <button style={styles}>{label}</button>;
}
