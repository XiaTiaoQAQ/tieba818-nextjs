import {Card, Container, Divider, Typography} from "@mui/material";
import CardContent from "@mui/material/CardContent";

export default function SearchHistory() {
    return (
        <Container maxWidth="sm" style={{marginTop: '20px'}}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        搜索历史
                    </Typography>
                    <Divider style={{marginBottom: '15px'}}/>
                </CardContent>
            </Card>
        </Container>
    )
}
