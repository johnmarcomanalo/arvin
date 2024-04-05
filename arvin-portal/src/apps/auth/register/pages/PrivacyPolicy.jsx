import React from "react";
import { Button, Grid } from "@mui/material";
const PrivacyPolicy = (props) => {
  return (
    <div style={{ padding: 20, textAlign: "justify" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <span style={{ fontWeight: "bold" }}>PRIVACY POLICY</span>
        </Grid>
        <Grid item xs={12} md={12}>
          <span style={{ textAlign: "justify" }}>
            We take your privacy very seriously. This privacy policy (the
            "Policy") explains how we collect, use, and disclose your personal
            information when you use ConEx San Luis(the "App").
          </span>
        </Grid>
        <Grid item xs={12} md={12}>
          <span style={{ textAlign: "justify" }}>
            1. Information We Collect (a) Personal Information: We collect
            personal information that you provide to us when you register for an
            account or use the App, such as your name, email address, phone
            number, and payment information. (b) Usage Information: We collect
            information about your use of the App, such as the services you
            request and the service providers you book. (c) Device Information:
            We may collect information about the device you use to access the
            App, such as your device type, operating system, and browser type.
            (d) Location Information: We may collect information. about your
            location when you use the App if you allow us to access your
            device's location services.
          </span>
        </Grid>
        <Grid item xs={12} md={12}>
          <span style={{ textAlign: "justify" }}>
            2. How We Use Your Information We use your information to provide
            and improve the App, to communicate with you about your account and
            services, to process payments, and to comply with legal and
            regulatory requirements.
          </span>
        </Grid>
        <Grid item xs={12} md={12}>
          <span style={{ textAlign: "justify" }}>
            3. Disclosure of Your Information (a) Service Providers: We may
            share your information with service providers who provide services
            through the App. (b) Service Seeker: We may share your information
            with service providers who provide services through the App (c)
            Third Parties: We may share your information with third-party
            service providers who help us to operate the App, such as payment
            processors and analytics providers. (d) Legal Requirements: We may
            disclose your information if required by law or legal process, such
            as to comply with a subpoena or court order.
          </span>
        </Grid>
        <Grid item xs={12} md={12}>
          <span style={{ textAlign: "justify" }}>
            4. Your Choices You can choose not to provide certain personal
            information, but this may limit your ability to use the App. You can
            also choose to disable location services in your device settings or
            choose to restrict the App's access to your device's location.
          </span>
        </Grid>
        <Grid item xs={12} md={12}>
          <span style={{ textAlign: "justify" }}>
            5. Data Security We take reasonable measures to protect your
            information from unauthorized access, use, or disclosure. However,
            no method of transmission over the Internet or electronic storage is
            100% secure.
          </span>
        </Grid>
        <Grid item xs={12} md={12}>
          <span style={{ textAlign: "justify" }}>
            6. Children's Privacy The App is not intended for use by children
            under the age of 13. We do not knowingly collect personal
            information from children under the age of 13.
          </span>
        </Grid>
        <Grid item xs={12} md={12}>
          <span style={{ textAlign: "justify" }}>
            7. Changes to the Policy We reserve the right to modify this Policy
            at any time. Any changes will be effective immediately upon posting.
            Your continued use of the App after any changes to this policy will
            constitute your acceptance of the changes.
          </span>
        </Grid>
        <Grid item xs={12} md={12}>
          <span style={{ textAlign: "justify" }}>
            8. Contact Us If you have any questions or concerns about this
            Policy or our privacy practices, please contact us at
            rkatienza2@gmail.com.
          </span>
        </Grid>
        <Grid item xs={12} md={12}>
          <span style={{ textAlign: "justify" }}>
            By using the App, you agree to the terms of this Policy. If you do
            not agree to this Policy, you should not use the App.
          </span>
        </Grid>
        <Grid item xs={12} md={12}>
          <div style={{ marginTop: 20 }}></div>
        </Grid>
        {props.onAgree ? (
          <Grid item xs={12} md={12}>
            <Button
              onClick={props.onAgree}
              style={{ backgroundColor: "#3498db", color: "#fff" }}
              fullWidth
            >
              I Agree
            </Button>
          </Grid>
        ) : null}
      </Grid>
    </div>
  );
};

export default PrivacyPolicy;
