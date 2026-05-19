import axios from "axios";

function App() {

  const testBackend =
    async () => {

      try {

        const response =
          await axios.get(
            "https://crypto-ml-platform-02b7.onrender.com/strategy-performance"
          );

        console.log(
          response.data
        );

        alert(
          "Backend Connected!"
        );

      } catch (err) {

        console.error(err);

        alert(
          "Backend Failed"
        );
      }
    };

  return (

    <div
      style={{
        backgroundColor: "#111827",
        color: "white",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >

      <h1>
        AI Trading Dashboard
      </h1>

      <button
        onClick={testBackend}
        style={{
          padding: "12px",
          marginTop: "20px",
          fontSize: "16px",
        }}
      >
        Test Backend Connection
      </button>

    </div>
  );
}

export default App;
