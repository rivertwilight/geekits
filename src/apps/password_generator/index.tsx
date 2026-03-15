import React, { useState, useCallback } from "react";
import {
	Box,
	Button,
	Typography,
	Slider,
	FormGroup,
	FormControlLabel,
	Checkbox,
	IconButton,
	Stack,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import OutlinedCard from "@/components/OutlinedCard";

const CHAR_SETS = {
	uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	lowercase: "abcdefghijklmnopqrstuvwxyz",
	numbers: "0123456789",
	symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

const PasswordGenerator: React.FC = () => {
	const [length, setLength] = useState(16);
	const [options, setOptions] = useState({
		uppercase: true,
		lowercase: true,
		numbers: true,
		symbols: true,
	});
	const [passwords, setPasswords] = useState<string[]>([]);

	const generate = useCallback(() => {
		let chars = "";
		if (options.uppercase) chars += CHAR_SETS.uppercase;
		if (options.lowercase) chars += CHAR_SETS.lowercase;
		if (options.numbers) chars += CHAR_SETS.numbers;
		if (options.symbols) chars += CHAR_SETS.symbols;

		if (!chars) return;

		const results: string[] = [];
		const array = new Uint32Array(length * 5);
		crypto.getRandomValues(array);

		for (let j = 0; j < 5; j++) {
			let password = "";
			for (let i = 0; i < length; i++) {
				password += chars[array[j * length + i] % chars.length];
			}
			results.push(password);
		}
		setPasswords(results);
	}, [length, options]);

	const copyPassword = (pw: string) => {
		navigator.clipboard.writeText(pw);
	};

	return (
		<Box sx={{ maxWidth: 500, mx: "auto", p: 2 }}>
			<OutlinedCard>
				<Box sx={{ px: 3, py: 2 }}>
					<Typography gutterBottom>
						Length: {length}
					</Typography>
					<Slider
						value={length}
						onChange={(_, v) => setLength(v as number)}
						min={4}
						max={64}
						step={1}
						valueLabelDisplay="auto"
					/>

					<FormGroup row sx={{ mb: 2 }}>
						{(Object.keys(CHAR_SETS) as Array<keyof typeof CHAR_SETS>).map(
							(key) => (
								<FormControlLabel
									key={key}
									control={
										<Checkbox
											checked={options[key]}
											onChange={(e) =>
												setOptions({
													...options,
													[key]: e.target.checked,
												})
											}
										/>
									}
									label={key.charAt(0).toUpperCase() + key.slice(1)}
								/>
							)
						)}
					</FormGroup>

					<Button
						variant="contained"
						fullWidth
						onClick={generate}
						startIcon={<RefreshIcon />}
					>
						Generate
					</Button>
				</Box>
			</OutlinedCard>

			{passwords.length > 0 && (
				<Stack spacing={1} sx={{ mt: 2 }}>
					{passwords.map((pw, i) => (
						<OutlinedCard key={i}>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									px: 2,
									py: 1,
								}}
							>
								<Typography
									sx={{
										flex: 1,
										fontFamily: "monospace",
										fontSize: 14,
										wordBreak: "break-all",
									}}
								>
									{pw}
								</Typography>
								<IconButton
									size="small"
									onClick={() => copyPassword(pw)}
								>
									<ContentCopyIcon fontSize="small" />
								</IconButton>
							</Box>
						</OutlinedCard>
					))}
				</Stack>
			)}
		</Box>
	);
};

export default PasswordGenerator;
