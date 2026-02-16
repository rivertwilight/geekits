import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import OutlinedCard from "@/components/OutlinedCard";

interface DecodedField {
	label: string;
	value: string;
	raw: string;
}

const WEATHER_CODES: Record<string, string> = {
	// Intensity
	"-": "Light",
	"+": "Heavy",
	VC: "In the vicinity",
	// Descriptor
	MI: "Shallow",
	PR: "Partial",
	BC: "Patches",
	DR: "Low drifting",
	BL: "Blowing",
	SH: "Showers",
	TS: "Thunderstorm",
	FZ: "Freezing",
	// Precipitation
	RA: "Rain",
	DZ: "Drizzle",
	SN: "Snow",
	SG: "Snow grains",
	IC: "Ice crystals",
	PL: "Ice pellets",
	GR: "Hail",
	GS: "Small hail",
	UP: "Unknown precipitation",
	// Obscuration
	FG: "Fog",
	BR: "Mist",
	HZ: "Haze",
	SA: "Sand",
	DU: "Dust",
	FU: "Smoke",
	VA: "Volcanic ash",
	PY: "Spray",
	// Other
	SQ: "Squall",
	PO: "Dust/sand whirls",
	DS: "Duststorm",
	SS: "Sandstorm",
	FC: "Funnel cloud/tornado",
};

const CLOUD_CODES: Record<string, string> = {
	SKC: "Sky clear",
	CLR: "Clear",
	FEW: "Few (1-2 oktas)",
	SCT: "Scattered (3-4 oktas)",
	BKN: "Broken (5-7 oktas)",
	OVC: "Overcast (8 oktas)",
	VV: "Vertical visibility",
};

const CLOUD_TYPES: Record<string, string> = {
	CB: "Cumulonimbus",
	TCU: "Towering cumulus",
};

function parseTemperature(raw: string): number {
	if (raw.startsWith("M")) {
		return -parseInt(raw.slice(1), 10);
	}
	return parseInt(raw, 10);
}

function decodeWeather(code: string): string {
	let result = "";
	let i = 0;

	if (code[0] === "-" || code[0] === "+") {
		result += WEATHER_CODES[code[0]] + " ";
		i = 1;
	}

	if (code.substring(i, i + 2) === "VC") {
		result += WEATHER_CODES["VC"] + " ";
		i += 2;
	}

	while (i < code.length) {
		const pair = code.substring(i, i + 2);
		if (WEATHER_CODES[pair]) {
			result += WEATHER_CODES[pair] + " ";
		}
		i += 2;
	}

	return result.trim() || code;
}

function decodeMetar(metar: string): DecodedField[] {
	const fields: DecodedField[] = [];
	const parts = metar.trim().toUpperCase().split(/\s+/);
	let i = 0;

	// Report type
	if (parts[i] === "METAR" || parts[i] === "SPECI") {
		fields.push({
			label: "Report Type",
			value:
				parts[i] === "METAR"
					? "Routine report"
					: "Special (unscheduled) report",
			raw: parts[i],
		});
		i++;
	}

	// Station identifier
	if (i < parts.length && /^[A-Z]{4}$/.test(parts[i])) {
		fields.push({
			label: "Station",
			value: `ICAO: ${parts[i]}`,
			raw: parts[i],
		});
		i++;
	}

	// Date/Time
	if (i < parts.length && /^\d{6}Z$/.test(parts[i])) {
		const raw = parts[i];
		const day = raw.substring(0, 2);
		const hour = raw.substring(2, 4);
		const min = raw.substring(4, 6);
		fields.push({
			label: "Observation Time",
			value: `Day ${day}, ${hour}:${min} UTC`,
			raw,
		});
		i++;
	}

	// AUTO / COR
	if (i < parts.length && (parts[i] === "AUTO" || parts[i] === "COR")) {
		fields.push({
			label: "Modifier",
			value:
				parts[i] === "AUTO"
					? "Fully automated report"
					: "Corrected report",
			raw: parts[i],
		});
		i++;
	}

	// Wind
	if (i < parts.length && /^\d{3}\d{2,3}(G\d{2,3})?(KT|MPS)$/.test(parts[i])) {
		const raw = parts[i];
		const dir = raw.substring(0, 3);
		const unit = raw.endsWith("MPS") ? "m/s" : "knots";
		const gustMatch = raw.match(/G(\d{2,3})/);
		const speedEnd = gustMatch ? raw.indexOf("G") : raw.length - 2 - (unit === "m/s" ? 1 : 0);
		const speed = raw.substring(3, speedEnd);
		let value = `From ${dir}° at ${parseInt(speed, 10)} ${unit}`;
		if (gustMatch) {
			value += `, gusting to ${parseInt(gustMatch[1], 10)} ${unit}`;
		}
		fields.push({ label: "Wind", value, raw });
		i++;
	} else if (i < parts.length && /^VRB\d{2,3}(KT|MPS)$/.test(parts[i])) {
		const raw = parts[i];
		const unit = raw.endsWith("MPS") ? "m/s" : "knots";
		const speed = raw.substring(3, raw.length - (unit === "m/s" ? 3 : 2));
		fields.push({
			label: "Wind",
			value: `Variable at ${parseInt(speed, 10)} ${unit}`,
			raw,
		});
		i++;
	} else if (i < parts.length && parts[i] === "00000KT") {
		fields.push({ label: "Wind", value: "Calm", raw: parts[i] });
		i++;
	}

	// Variable wind direction
	if (i < parts.length && /^\d{3}V\d{3}$/.test(parts[i])) {
		const raw = parts[i];
		const from = raw.substring(0, 3);
		const to = raw.substring(4, 7);
		fields.push({
			label: "Wind Variability",
			value: `Varying between ${from}° and ${to}°`,
			raw,
		});
		i++;
	}

	// Visibility
	if (i < parts.length && /^(\d{4}|(\d+\s)?(\d\/\d)?SM|CAVOK|P6SM|M\d\/\dSM|\d+SM)$/.test(parts[i])) {
		const raw = parts[i];
		if (raw === "CAVOK") {
			fields.push({
				label: "Visibility",
				value: "Ceiling and visibility OK (>10 km, no significant weather)",
				raw,
			});
		} else if (raw === "9999") {
			fields.push({
				label: "Visibility",
				value: "10 km or more",
				raw,
			});
		} else if (raw.endsWith("SM")) {
			const vis = raw.replace("SM", "");
			if (vis === "P6") {
				fields.push({
					label: "Visibility",
					value: "More than 6 statute miles",
					raw,
				});
			} else {
				fields.push({
					label: "Visibility",
					value: `${vis} statute miles`,
					raw,
				});
			}
		} else {
			fields.push({
				label: "Visibility",
				value: `${parseInt(raw, 10)} meters`,
				raw,
			});
		}
		i++;
	}

	// Handle fractional visibility (e.g., "1 1/2SM")
	if (
		i < parts.length &&
		/^\d\/\d+SM$/.test(parts[i]) &&
		fields.length > 0 &&
		fields[fields.length - 1].label === "Visibility"
	) {
		const prev = fields[fields.length - 1];
		const wholePart = prev.raw;
		const raw = `${wholePart} ${parts[i]}`;
		fields[fields.length - 1] = {
			label: "Visibility",
			value: `${wholePart} ${parts[i].replace("SM", "")} statute miles`,
			raw,
		};
		i++;
	}

	// Weather phenomena
	const weatherPattern = /^(-|\+|VC)?(MI|PR|BC|DR|BL|SH|TS|FZ)?(RA|DZ|SN|SG|IC|PL|GR|GS|UP|FG|BR|HZ|SA|DU|FU|VA|PY|SQ|PO|DS|SS|FC)+$/;
	while (i < parts.length && weatherPattern.test(parts[i])) {
		fields.push({
			label: "Weather",
			value: decodeWeather(parts[i]),
			raw: parts[i],
		});
		i++;
	}

	// Cloud layers
	const cloudPattern = /^(SKC|CLR|FEW|SCT|BKN|OVC|VV)(\d{3})(CB|TCU)?$/;
	while (i < parts.length && (cloudPattern.test(parts[i]) || parts[i] === "SKC" || parts[i] === "CLR" || parts[i] === "NCD" || parts[i] === "NSC")) {
		const raw = parts[i];
		if (raw === "NCD") {
			fields.push({ label: "Clouds", value: "No clouds detected", raw });
		} else if (raw === "NSC") {
			fields.push({
				label: "Clouds",
				value: "No significant clouds",
				raw,
			});
		} else if (raw === "SKC" || raw === "CLR") {
			fields.push({
				label: "Clouds",
				value: CLOUD_CODES[raw],
				raw,
			});
		} else {
			const match = raw.match(cloudPattern);
			if (match) {
				const cover = CLOUD_CODES[match[1]] || match[1];
				const altitude = parseInt(match[2], 10) * 100;
				const type = match[3] ? ` (${CLOUD_TYPES[match[3]]})` : "";
				fields.push({
					label: "Clouds",
					value: `${cover} at ${altitude.toLocaleString()} ft${type}`,
					raw,
				});
			}
		}
		i++;
	}

	// Temperature/Dewpoint
	if (i < parts.length && /^M?\d{2}\/M?\d{2}$/.test(parts[i])) {
		const raw = parts[i];
		const [tempRaw, dewRaw] = raw.split("/");
		const temp = parseTemperature(tempRaw);
		const dew = parseTemperature(dewRaw);
		fields.push({
			label: "Temperature",
			value: `${temp}°C (${Math.round(temp * 1.8 + 32)}°F)`,
			raw: tempRaw,
		});
		fields.push({
			label: "Dewpoint",
			value: `${dew}°C (${Math.round(dew * 1.8 + 32)}°F)`,
			raw: dewRaw,
		});
		i++;
	}

	// Altimeter
	if (i < parts.length && /^A\d{4}$/.test(parts[i])) {
		const raw = parts[i];
		const inhg = parseInt(raw.substring(1), 10) / 100;
		const hpa = Math.round(inhg * 33.8639);
		fields.push({
			label: "Altimeter",
			value: `${inhg.toFixed(2)} inHg (${hpa} hPa)`,
			raw,
		});
		i++;
	} else if (i < parts.length && /^Q\d{4}$/.test(parts[i])) {
		const raw = parts[i];
		const hpa = parseInt(raw.substring(1), 10);
		const inhg = (hpa / 33.8639).toFixed(2);
		fields.push({
			label: "Altimeter (QNH)",
			value: `${hpa} hPa (${inhg} inHg)`,
			raw,
		});
		i++;
	}

	// Remarks
	if (i < parts.length && parts[i] === "RMK") {
		const rmkParts = parts.slice(i + 1);
		if (rmkParts.length > 0) {
			fields.push({
				label: "Remarks",
				value: rmkParts.join(" "),
				raw: parts.slice(i).join(" "),
			});
		}
	}

	return fields;
}

const EXAMPLE_METAR =
	"METAR KJFK 121856Z 31009KT 10SM FEW250 M04/M17 A3049 RMK AO2 SLP324";

const MetarDecoder: React.FC = () => {
	const [input, setInput] = useState("");
	const [decoded, setDecoded] = useState<DecodedField[]>([]);
	const [error, setError] = useState("");

	const handleDecode = () => {
		const trimmed = input.trim();
		if (!trimmed) {
			setError("Please enter a METAR string.");
			setDecoded([]);
			return;
		}
		setError("");
		const result = decodeMetar(trimmed);
		if (result.length === 0) {
			setError("Could not parse the METAR string. Please check the format.");
		}
		setDecoded(result);
	};

	const handleExample = () => {
		setInput(EXAMPLE_METAR);
		setError("");
		setDecoded(decodeMetar(EXAMPLE_METAR));
	};

	return (
		<Box sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
			<OutlinedCard>
				<Box sx={{ p: 2 }}>
					<TextField
						fullWidth
						multiline
						minRows={2}
						label="METAR"
						value={input}
						onChange={(e) => {
							setInput(e.target.value);
							setError("");
						}}
						placeholder={EXAMPLE_METAR}
						margin="normal"
					/>
					<Box
						sx={{
							display: "flex",
							gap: 1,
							mt: 1,
						}}
					>
						<Button
							variant="contained"
							color="primary"
							onClick={handleDecode}
							sx={{ flex: 1 }}
						>
							Decode
						</Button>
						<Button
							variant="outlined"
							onClick={handleExample}
						>
							Example
						</Button>
					</Box>
					{error && (
						<Typography color="error" sx={{ mt: 2 }}>
							{error}
						</Typography>
					)}
					{decoded.length > 0 && (
						<Box sx={{ mt: 3 }}>
							<Divider sx={{ mb: 2 }} />
							{decoded.map((field, idx) => (
								<Box
									key={idx}
									sx={{
										display: "flex",
										flexDirection: {
											xs: "column",
											sm: "row",
										},
										gap: { xs: 0.5, sm: 2 },
										py: 1.5,
										borderBottom: "1px solid",
										borderColor: "divider",
										"&:last-child": {
											borderBottom: "none",
										},
									}}
								>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 1,
											minWidth: 160,
										}}
									>
										<Typography
											variant="body2"
											fontWeight={600}
										>
											{field.label}
										</Typography>
										<Chip
											label={field.raw}
											size="small"
											variant="outlined"
											sx={{ fontFamily: "monospace" }}
										/>
									</Box>
									<Typography variant="body1">
										{field.value}
									</Typography>
								</Box>
							))}
						</Box>
					)}
				</Box>
			</OutlinedCard>
		</Box>
	);
};

export default MetarDecoder;
