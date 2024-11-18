"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { enable2fa, get2faSecret, disable2fa } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const TwoFactorAuthForm = ({
  twoFactorAuthActivated,
}: {
  twoFactorAuthActivated: boolean;
}) => {
  const { toast } = useToast();
  const [isActivated, setIsActivated] = useState(twoFactorAuthActivated);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [otp, setOtp] = useState("");

  const handleEnableClick = async () => {
    const response = await get2faSecret();

    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.message,
      });
    }

    setStep(2);
    setCode(response?.twoFactorSecret ?? "");
  };

  const handleOPTSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await enable2fa(otp);

    console.log(response);

    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.message,
      });
    } else {
      toast({
        className: "bg-green-500",
        title: "Success",
        description: "Two Factor Authentication has been enabled",
      });
      setIsActivated(true);
    }
  };

  const handleDisable2faClick = async () => {
    const response = await disable2fa();
    if (response?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.message,
      });
    } else {
      toast({
        className: "bg-green-500",
        title: "Success",
        description: "Two Factor Authentication has been diabled",
      });
      setIsActivated(false);
      setStep(1);
    }
  };

  return (
    <div className="mt-4">
      {!isActivated ? (
        <div>
          {step === 1 && (
            <Button className="w-full" onClick={handleEnableClick}>
              开启二次验证
            </Button>
          )}
          {step === 2 && (
            <div>
              <p className="text-sm text-muted-foreground mt-3">
                Scan this QR Code with Google Authenticator to proceed
              </p>
              <QRCodeSVG value={code} />
              <div className="flex justify-center items-center mt-3 gap-2">
                <Button
                  className="w-[1/3] mt-3"
                  onClick={() => setStep(1)}
                  variant={"outline"}
                >
                  返回
                </Button>
                <Button className="w-[1/3] mt-3" onClick={() => setStep(3)}>
                  我已扫描
                </Button>
              </div>
            </div>
          )}

          {step == 3 && (
            <form
              className="flex-col gap-2 items-center justify-center w-[350px]"
              onSubmit={handleOPTSubmit}
            >
              <p className="text-sm text-muted-foreground mt-3">
                Please enter the one-time passcode from Google Authenticator
              </p>

              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <Button
                className="w-full mt-3"
                type="submit"
                disabled={otp.length != 6}
              >
                提交
              </Button>
              <Button
                className="w-full mt-3"
                variant={"outline"}
                onClick={() => setStep(2)}
              >
                取消
              </Button>
            </form>
          )}
        </div>
      ) : (
        <Button variant={"destructive"} onClick={handleDisable2faClick}>
          取消设置二次验证码
        </Button>
      )}
    </div>
  );
};

export default TwoFactorAuthForm;
