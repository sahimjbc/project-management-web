interface Config {
    API_BASE_URL: string;
}

const hostname = window.location.hostname;

function getConfig(): Config {
    switch (hostname) {
      case "localhost":
      case "127.0.0.1":
      case "10.10.11.54":
        return {
          API_BASE_URL: "http://10.10.11.164:8080/api/v1",
        };

      case "kouraku-test.userside.co.jp":
        return {
          API_BASE_URL:
            "https://kouraku-test.userside.co.jp/kouraku-api/api/v1",
        };
      default:
        return {
          API_BASE_URL:
            "https://kouraku-test.userside.co.jp/kouraku-api/api/v1",
        };
    }
}

export default getConfig();
