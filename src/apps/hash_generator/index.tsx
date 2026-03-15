import React, { useState } from "react";
import {
	Box,
	TextField,
	Button,
	Typography,
	IconButton,
	Stack,
	Tabs,
	Tab,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OutlinedCard from "@/components/OutlinedCard";

const ALGORITHMS = ["SHA-256", "SHA-384", "SHA-512", "SHA-1"] as const;

const arrayBufferToHex = (buffer: ArrayBuffer): string => {
	return Array.from(new Uint8Array(buffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
};

const computeHash = async (
	text: string,
	algorithm: string
): Promise<string> => {
	const encoder = new TextEncoder();
	const data = encoder.encode(text);
	const hashBuffer = await crypto.subtle.digest(algorithm, data);
	return arrayBufferToHex(hashBuffer);
};

const HashGenerator: React.FC = () => {
	const [input, setInput] = useState("");
	const [tab, setTab] = useState(0);
	const [hashes, setHashes] = useState<Record<string, string>>({});

	const generateHashes = async () => {
		if (!input) return;
		const results: Record<string, string> = {};
		for (const algo of ALGORITHMS) {
			results[algo] = await computeHash(input, algo);
		}
		setHashes(results);
	};

	const copyHash = (value: string) => {
		navigator.clipboard.writeText(value);
	};

	return (
		<Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
			<Tabs
				value={tab}
				onChange={(_, v) => setTab(v)}
				variant="fullWidth"
				sx={{ mb: 2 }}
			>
				<Tab label="Text" />
			</Tabs>

			<TextField
				fullWidth
				multiline
				minRows={3}
				maxRows={8}
				label="Input Text"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Enter text to hash..."
				sx={{ mb: 2 }}
			/>

			<Button
				variant="contained"
				fullWidth
				onClick={generateHashes}
				sx={{ mb: 2 }}
			>
				Generate Hashes
			</Button>

			{Object.keys(hashes).length > 0 && (
				<Stack spacing={1.5}>
					{ALGORITHMS.map((algo) => (
						<OutlinedCard key={algo}>
							<Box sx={{ px: 2, py: 1.5 }}>
								<Box
									display="flex"
									justifyContent="space-between"
									alignItems="center"
								>
									<Typography
										variant="subtitle2"
										color="text.secondary"
									>
										{algo}
									</Typography>
									<IconButton
										size="small"
										onClick={() => copyHash(hashes[algo])}
									>
										<ContentCopyIcon fontSize="small" />
									</IconButton>
								</Box>
								<Typography
									sx={{
										fontFamily: "monospace",
										fontSize: 13,
										wordBreak: "break-all",
										mt: 0.5,
									}}
								>
									{hashes[algo]}
								</Typography>
							</Box>
						</OutlinedCard>
					))}
				</Stack>
			)}
		</Box>
	);
};

export default HashGenerator;
