export default async function (data) {

    const owner = 'wangyuanzcm';
    const repo = 'cronlunch';
    // const title = '0x0f0067cd819cB8F20BDa62046dAFF7a2b5c88280';
    const issueNumber = 2;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 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");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("User-Agent", "my-app/1.0.0");

    const raw = JSON.stringify({ body:JSON.stringify(data)});
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`, requestOptions)
      const result = await response.text();
      console.log(result)
      return true
}
