import React, { useState } from "react";
import {
	Box,
	TextField,
	Button,
	Typography,
	Stack,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OutlinedCard from "@/components/OutlinedCard";

const JsonFormatter: React.FC = () => {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [indent, setIndent] = useState(2);

	const format = () => {
		try {
			const parsed = JSON.parse(input);
			setOutput(JSON.stringify(parsed, null, indent));
			setError("");
		} catch (e) {
			setError((e as Error).message);
			setOutput("");
		}
	};

	const minify = () => {
		try {
			const parsed = JSON.parse(input);
			setOutput(JSON.stringify(parsed));
			setError("");
		} catch (e) {
			setError((e as Error).message);
			setOutput("");
		}
	};

	const copyOutput = () => {
		navigator.clipboard.writeText(output);
	};

	return (
		<Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
			<TextField
				fullWidth
				multiline
				minRows={8}
				maxRows={20}
				label="Input JSON"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder='{"key": "value"}'
				sx={{ mb: 2, fontFamily: "monospace" }}
				InputProps={{ sx: { fontFamily: "monospace", fontSize: 14 } }}
			/>

			<Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
				<Button variant="contained" onClick={format}>
					Format
				</Button>
				<Button variant="outlined" onClick={minify}>
					Minify
				</Button>
				<FormControl size="small" sx={{ minWidth: 120 }}>
					<InputLabel>Indent</InputLabel>
					<Select
						value={indent}
						label="Indent"
						onChange={(e) => setIndent(Number(e.target.value))}
					>
						<MenuItem value={2}>2 spaces</MenuItem>
						<MenuItem value={4}>4 spaces</MenuItem>
						<MenuItem value={1}>1 tab</MenuItem>
					</Select>
				</FormControl>
			</Stack>

			{error && (
				<OutlinedCard padding={2}>
					<Typography color="error" variant="body2" sx={{ fontFamily: "monospace" }}>
						{error}
					</Typography>
				</OutlinedCard>
			)}

			{output && (
				<Box sx={{ mt: 2 }}>
					<Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
						<Typography variant="subtitle2" color="text.secondary">
							Output
						</Typography>
						<Button
							size="small"
							startIcon={<ContentCopyIcon />}
							onClick={copyOutput}
						>
							Copy
						</Button>
					</Box>
					<TextField
						fullWidth
						multiline
						maxRows={20}
						value={output}
						InputProps={{
							readOnly: true,
							sx: { fontFamily: "monospace", fontSize: 14 },
						}}
					/>
				</Box>
			)}
		</Box>
	);
};

export default JsonFormatter;
