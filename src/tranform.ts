import cheerio from 'cheerio';
const prefixUrl = 'https://bscscan.com';

interface TransformType {
	totaleth: string;
	totalusd: string;
	recordsfound: string;
	layout: string;
	usdpercentagechange: string;
}

export interface StoreType {
	created_time: number;
	totaleth: string;
	totalusd: string;
	total: string;
	pic: string;
	TokenName: string;
	TokenHash: string | undefined;
	Symbol: string;
	Quantity: string;
	TokenPrice: string;
	Change24h: string;
	ValueIInBNB: string;
	ValueInUSD: string;
}

export default function (data: TransformType): StoreType[] {
	const { totaleth, totalusd, recordsfound, layout } = data;
	const $recordsfound = cheerio.load(recordsfound);
	// 当前的token总数
	const total = $recordsfound('strong').text();
	const $ = cheerio.load(`<table>${layout}</table>`);
	// 采集的时间
	const created_time = new Date().getTime();
	const list = $('tr')
		.map((i, $tr) => {
			const $tds = $tr.children;
			const [_, TokenName, Symbol, Quantity, TokenPrice, Change24h, ValueIInBNB, ValueInUSD] = $tds;
			// console.log(TokenName, 'tokenName')
			// 有时候可能在span里面，有时候直接在a标签里面
			const _TokenName =
				$(TokenName).find('.media-body a span').attr('title') || $(TokenName).find('.media-body a.font-weight-bold').text();
			const _TokenHash = $(TokenName).find('.media-body a.d-block').attr('title');
			return {
				created_time,
				totaleth,
				totalusd,
				total,
				pic: prefixUrl + $(TokenName).find('.u-sm-avatar').attr('src'),
				TokenName: _TokenName,
				TokenHash: _TokenHash,
				Symbol: $(Symbol).text(),
				Quantity: $(Quantity).text(),
				TokenPrice: $(TokenPrice).text(),
				Change24h: $(Change24h).text(),
				ValueIInBNB: $(ValueIInBNB).text(),
				ValueInUSD: $(ValueInUSD).text(),
			};
		})
		.toArray();
	console.log(list, 'list');
	return list;
}
