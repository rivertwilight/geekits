import React, { useState, useEffect } from "react";
import Link from "next/link";
import fiv from "../utils/Services/fiv";
import OutlinedCard from "./OutlinedCard";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const AppItem = ({
	data,
	removeFromFiv,
	addToFiv,
}: {
	data: IApp;
	removeFromFiv: () => void;
	addToFiv: () => void;
}) => {
	const [fiv, setFiv] = useState(true);
	const { name, link = "/" } = data;
	const handleClick = (e: any) => {
		e.preventDefault();
		fiv && removeFromFiv && removeFromFiv();
		!fiv && addToFiv && addToFiv();
		setFiv(!fiv);
	};
	return (
        <Grid item sm={6} xs={12}>
            <Link href={`/app/${link}`}>
                {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                }
                <ListItem button key={name}>
					<ListItemIcon onClick={handleClick}>
						{fiv ? <StarIcon /> : <StarBorderIcon />}
					</ListItemIcon>
					<ListItemText primary={name} />
				</ListItem>
            </Link>
        </Grid>
    );
};

const Bookmark = () => {
	const [list, setList] = useState([]);

	useEffect(() => {
		setList(fiv.getAll());
	}, []);

	if(!!!list.length) return null

	return (
		<OutlinedCard padding={1}>
			<List
				aria-labelledby="nested-list-subheader"
				subheader={
					<ListSubheader
						sx={{ background: "unset" }}
						component="div"
						id="nested-list-subheader"
					>
						收藏
					</ListSubheader>
				}
			>
				{!list.length && (
					<div className="center-with-flex">
						<img
							height="120"
							width="120"
							src="/illustration/undraw_not_found_-60-pq.svg"
						/>
						<Typography variant="subtitle1">
							&nbsp;空空如也...
						</Typography>
					</div>
				)}
				{list.length > 0 && (
					<Grid container spacing={3}>
						{list.map((app, i) => (
							<AppItem
								key={app.link}
								data={app}
								addToFiv={() => {
									fiv.add(app);
								}}
								removeFromFiv={() => {
									fiv.delete(i);
								}}
							/>
						))}
					</Grid>
				)}
			</List>
		</OutlinedCard>
	);
};

export default Bookmark;
