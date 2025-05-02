const { default: axios } = require("axios");
const { useEffect } = require("react");

function Test() {
  useEffect (() => {
    const fetchHelloworld = async () => {
      const res = await axios.get("http://localhost:8080/v1/api/");
      console.log(">>>> Check res: ", res);
    }
    fetchHelloworld();
  }, [])
}

// module.exports Test ;