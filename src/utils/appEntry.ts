import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// !! next/dynamic options must be an object literal !!

const appImportList: Record<string, ComponentType> = {
	cem: dynamic(() => import("../apps/cem"), {
		ssr: false,
	}),
	counter: dynamic(() => import("../apps/counter"), {
		ssr: false,
	}),
	gif_maker: dynamic(() => import("../apps/gif_maker"), {
		ssr: false,
	}),
	lottery: dynamic(() => import("../apps/lottery"), {
		ssr: false,
	}),
	icon_maker: dynamic(() => import("../apps/icon_maker"), {
		ssr: false,
	}),
	mc_command: dynamic(() => import("../apps/mc_command"), {
		ssr: false,
	}),
	gta_cheat_codes: dynamic(() => import("../apps/gta_cheat_codes"), {
		ssr: false,
	}),
	color_picker: dynamic(() => import("../apps/color_picker"), {
		ssr: false,
	}),
	date_calculator: dynamic(() => import("../apps/date_calculator"), {
		ssr: false,
	}),
	decision: dynamic(() => import("../apps/decision"), {
		ssr: false,
	}),
	text_compare: dynamic(() => import("../apps/text_compare"), {
		ssr: false,
	}),
	pdf_merger: dynamic(() => import("../apps/pdf_merger"), {
		ssr: false,
	}),
	dic_word: dynamic(() => import("../apps/dic_word"), {
		ssr: false,
	}),
	dic_idiom: dynamic(() => import("../apps/dic_idiom"), {
		ssr: false,
	}),
	dic_char: dynamic(() => import("../apps/dic_char"), {
		ssr: false,
	}),
	reg_exp_tester: dynamic(() => import("../apps/reg_exp_tester"), {
		ssr: false,
	}),
	url_cleaner: dynamic(() => import("../apps/url_cleaner"), {
		ssr: false,
	}),
	fuel_consumption_calculator: dynamic(
		() => import("../apps/fuel_consumption_calculator"),
		{
			ssr: false,
		},
	),
	length_unit_convertor: dynamic(
		() => import("../apps/length_unit_convertor"),
		{
			ssr: false,
		},
	),
	fake_pornhub_logo: dynamic(() => import("../apps/fake_pornhub_logo"), {
		ssr: false,
	}),
	screen_recorder: dynamic(() => import("../apps/screen_recorder"), {
		ssr: false,
	}),
	icon_slasher: dynamic(() => import("../apps/icon_slasher"), {
		ssr: false,
	}),
	pomodoro: dynamic(() => import("../apps/pomodoro"), {
		ssr: false,
	}),
	imomoe_parse: dynamic(() => import("../apps/imomoe_parse"), {
		ssr: false,
	}),
	js_keycode: dynamic(() => import("../apps/js_keycode"), {
		ssr: false,
	}),
	img2base64: dynamic(() => import("../apps/img2base64"), {
		ssr: false,
	}),
	img_compress: dynamic(() => import("../apps/img_compress"), {
		ssr: false,
	}),
	img_mosaic: dynamic(() => import("../../src/apps/img_mosaic"), {
		ssr: false,
	}),
	image_filter: dynamic(() => import("../apps/image_filter"), {
		ssr: false,
	}),
	folder_tree: dynamic(() => import("../apps/folder_tree"), {
		ssr: false,
	}),
	qrcode: dynamic(() => import("../apps/qrcode"), {
		ssr: false,
	}),
	tax_calculator: dynamic(() => import("../apps/tax_calculator"), {
		ssr: false,
	}),
	mimetype: dynamic(() => import("../apps/mimetype"), {
		ssr: false,
	}),
	html2jsx: dynamic(() => import("../apps/html2jsx"), {
		ssr: false,
	}),
	icon_generator: dynamic(() => import("../apps/icon_generator"), {
		ssr: false,
	}),
	jyutping_converter: dynamic(
		() => import("../apps/jyutping_converter/index"),
		{
			ssr: false,
		},
	),
	num2roman: dynamic(() => import("../apps/num2roman"), {
		ssr: false,
	}),
	grid_splitter: dynamic(() => import("../apps/grid_splitter"), {
		ssr: false,
	}),
	base64toimg: dynamic(() => import("../apps/base64toimg"), {
		ssr: false,
	}),
	hotpot_timer: dynamic(() => import("../apps/hotpot_timer"), {
		ssr: false,
	}),
	radio_signal_location_checker: dynamic(
		() => import("../apps/radio_signal_location_checker"),
		{
			ssr: false,
		},
	),
	convert_timestamp: dynamic(() => import("../apps/convert_timestamp"), {
		ssr: false,
	}),
	card_game_scorer: dynamic(() => import("../apps/card_game_scorer"), {
		ssr: false,
	}),
	metar_decoder: dynamic(() => import("../apps/metar_decoder"), {
		ssr: false,
	}),
};

export default appImportList;
