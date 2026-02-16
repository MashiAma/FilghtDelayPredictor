import React from 'react'
import { useState, useContext } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
} from "@mui/material";
import { AuthContext } from '../context/AuthContext'

const Help = () => {
  const { user } = useContext(AuthContext);
  const [activeKey, setActiveKey] = useState(null);
  const theme = useTheme();

  return (
    <>
      <Box p={3}>
        <Typography variant="h5" style={{
          border: "none",
          fontSize: "1.2rem",
          fontWeight: 'bold',
          marginBottom: "20px",
          color: theme.palette.text.main,
        }}>
          User Help Guide
        </Typography>
        <Card
          className="px-2 mt-2 mb-1"
          style={{
            minHeight: "400px",
            backgroundColor: theme.palette.background.paper,
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent>
            <Box mb={2}>
              <Typography variant="subtitle1" gutterBottom style={{ color: theme.palette.text.primary, fontWeight: "bold", marginBottom: "10px" }}>
                Get the most out of SkyGuard by following these steps:
              </Typography>
              <ol style={{ paddingLeft: "1.2rem", lineHeight: "1.8", color: theme.palette.text.primary, fontSize: "12px" }}>
                <li>
                  <strong>Complete Your Profile:</strong> Fill in all health and lifestyle
                  details, such as age, BMI, blood pressure, diet habits, sleep patterns,
                  and physical activity. Accurate data ensures more reliable diabetes risk predictions.
                </li>
                <li>
                  <strong>See Prediction:</strong> Click <b>Check Diabitic Risk</b> button in Your dashbaord. Make Sure Update Your Recent Health Data in Profile Page. Accurate data ensures more reliable diabetes risk predictions.
                </li>
                <li>
                  <strong>Analyze Your Trends:</strong> Use the Dashboard to track your
                  risk probability over time. Pay attention to lifestyle features like physical activity,
                  diet, alcohol consumption, and sleep. Consistent monitoring helps identify
                  improvements or areas needing attention.
                </li>
                <li>
                  <strong>Understand Your Reports:</strong> Each prediction includes your
                  risk level, probability, and suggested actions. Review recommendations
                  carefully, such as adjusting diet, increasing exercise, or consulting a healthcare professional.
                </li>
                <li><strong>View your prediction History</strong> All your past predictions are stored in the History section so you can track changes over time and monitor improvements in your health metrics.
                </li><li><strong>Risk Email Alerts:</strong>If your diabetes risk is assessed as high, you will automatically receive an email notification with your risk probability and recommended actions.
                </li>
                <li>
                  <strong>Contact Support:</strong> If you encounter issues or have questions
                  about interpreting your results, our support team is available to assist.
                </li>
              </ol>
            </Box>

            <Box textAlign="center" mt={5}>
              <Typography style={{ color: theme.palette.text.main }}>
                Need additional help? Reach out to our support team:
              </Typography>

              <Typography color="info" style={{ color: theme.palette.text.primary }}>
                📞 <strong>Call Us :</strong> +94 77 123 4567 | +94 11 234 5678
              </Typography>

              <Typography color="info" style={{ color: theme.palette.text.primary }}>
                📧 <strong>Email :</strong>{" "}
                <a href="mailto:support@mashiama.com">support@diapredict.com </a>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box >
    </>
  )
}

export default Help
