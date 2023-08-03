/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import tranform from './tranform';
import setIssue from './setIssue';

export interface Env {
	GITHUB_ACCESS_TOKEN: string;
}
// Export a default object containing event handlers
export default {
	// The fetch handler is invoked when this worker receives a HTTP(S) request
	// and should return a Response (optionally wrapped in a Promise)
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		console.log(env.GITHUB_ACCESS_TOKEN);

		var myHeaders = new Headers();
		myHeaders.append('authority', 'bscscan.com');
		myHeaders.append('accept', '*/*');
		myHeaders.append('accept-language', 'zh-CN,zh;q=0.9');
		myHeaders.append('cache-control', 'no-cache');
		myHeaders.append('content-type', 'application/json');
		myHeaders.append(
			'cookie',
			'_ga=GA1.1.1322970040.1682134967; __stripe_mid=c840994d-baf1-4a30-acb8-45b8a02ecc64659739; _ga_5Q0CRCD3YN=GS1.1.1683245272.1.0.1683245734.0.0.0; bitmedia_fid=eyJmaWQiOiIxZTgzZDFiODU4OTVlN2Y2ZGRjMjFhZTNmZWE1NTU3ZSIsImZpZG5vdWEiOiI0NWVhYjk0NmYwNGZiMTc5Yjc2ZmRkMjcxZDljYjEwZCJ9; bscscan_userid=tmxBsc; bscscan_pwd=4792:Qdxb:QSrOszt25l5beTZ1nwrtHcqgKoHBi1pUo9XgS7y/HvVOByeUP8e7bU8zFaYP0qd7; bscscan_autologin=True; __cuid=33cdd6ab90a148caa0c613ac0e1f556f; amp_fef1e8=accdb93a-623b-4ba3-b8a0-9215feac134aR...1h4ckep5t.1h4ckes02.2.1.3; ASP.NET_SessionId=oar3xjcdfnyagx00nl4twirf; __cflb=02DiuJNoxEYARvg2sN6b3yjRK7ShaYzuJwUwu3zoNuX72; cf_clearance=ZeawhfUl8GoaQ8YZvzG5VAkbg8VzVx.j7I3ifhmzGfY-1689689626-0-160.2.1689689608; _ga_PQY6J2Q8EP=GS1.1.1689688961.17.1.1689690036.0.0.0'
		);
		myHeaders.append('referer', 'https://bscscan.com/tokenholdings?a=0x0f0067cd819cb8f20bda62046daff7a2b5c88280');
		myHeaders.append('sec-ch-ua', '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"');
		myHeaders.append('sec-ch-ua-mobile', '?0');
		myHeaders.append('sec-ch-ua-platform', '"macOS"');
		myHeaders.append('sec-fetch-dest', 'empty');
		myHeaders.append('sec-fetch-mode', 'cors');
		myHeaders.append('sec-fetch-site', 'same-origin');
		myHeaders.append(
			'user-agent',
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
		);

		var requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow',
		};

		const response = await fetch(
			'https://bscscan.com/tokenholdingsHandler.aspx?&a=0x0f0067cd819cb8f20bda62046daff7a2b5c88280&q=&p=1&f=0&h=1&sort=total_price_usd&order=desc&pUsd24hrs=244&pBtc24hrs=0.00805928728815882&pUsd=239.91&fav=&langMsg=A%20total%20of%20XX%20tokenSS%20found&langFilter=Filtered%20by%20XX&langFirst=First&langPage=Page%20X%20of%20Y&langLast=Last&ps=100',
			requestOptions
		);
		const result = await response.text();
		try {
			const data = JSON.parse(result);
			const storeData = tranform(data);
			// console.log(tranform(data))
			await setIssue(env, storeData);
			return new Response(JSON.stringify(storeData), {
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': 'accept'
				},
			});
		} catch (err) {
			return new Response(err.message);
		}
	},
};
