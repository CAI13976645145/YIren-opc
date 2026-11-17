#!/usr/bin/env python3
"""原网关账号导出脚本（给 Agent 用，只用 Python 3 标准库）。

在运行旧 workbuddy2api 的机器上执行：
    python3 gateway-export.py --dir ~/wb2api/auths --out gateway-accounts.json

产物是 {"format":"workbuddy-accounts","accounts":[{account,auth}]}，
直接拖进「一人公司 → 网关 → 导入导出 → 上传 JSON 导入」。
"""
import argparse
import json
import os
import sys
from datetime import datetime, timezone


def normalize(raw):
    account = raw.get("account") if isinstance(raw.get("account"), dict) else raw
    auth = raw.get("auth") if isinstance(raw.get("auth"), dict) else raw
    uid = str(account.get("uid") or account.get("user_id") or raw.get("uid") or "").strip()
    access_token = str(
        auth.get("accessToken") or auth.get("access_token") or raw.get("access_token") or ""
    ).strip()
    refresh_token = str(
        auth.get("refreshToken") or auth.get("refresh_token") or raw.get("refresh_token") or ""
    ).strip()
    if not uid or not access_token:
        raise ValueError("缺少 uid 或 accessToken")
    item = {
        "account": {
            "uid": uid,
            "nickname": str(account.get("nickname") or account.get("name") or uid),
            "enterpriseId": str(account.get("enterpriseId") or account.get("enterprise_id") or ""),
        },
        "auth": {
            "accessToken": access_token,
            "refreshToken": refresh_token,
            "expiresAt": auth.get("expiresAt") or auth.get("expires_at") or raw.get("expires_at") or 0,
        },
    }
    realm = str(raw.get("realm") or account.get("realm") or "").lower()
    if realm == "global":
        item["account"]["realm"] = "global"
    return item


def main():
    parser = argparse.ArgumentParser(description="导出旧 WorkBuddy2API 网关账号")
    parser.add_argument("--dir", default=os.path.expanduser("~/wb2api/auths"), help="原网关 auths 目录")
    parser.add_argument("--out", default="gateway-accounts.json", help="输出 JSON 文件")
    args = parser.parse_args()

    auth_dir = os.path.expanduser(args.dir)
    if not os.path.isdir(auth_dir):
        print(f"目录不存在：{auth_dir}", file=sys.stderr)
        return 1
    files = sorted(name for name in os.listdir(auth_dir) if name.endswith(".json"))
    if not files:
        print(f"{auth_dir} 里没有 *.json", file=sys.stderr)
        return 1

    accounts, skipped = [], []
    for name in files:
        try:
            with open(os.path.join(auth_dir, name), "r", encoding="utf-8") as handle:
                accounts.append(normalize(json.load(handle)))
        except Exception as error:  # 单行容错，不因为一个坏文件中断整批
            skipped.append((name, str(error)))

    payload = {
        "format": "workbuddy-accounts",
        "version": 1,
        "source": "gateway-export",
        "exportedAt": datetime.now(timezone.utc).isoformat(),
        "accounts": accounts,
    }
    out = os.path.abspath(os.path.expanduser(args.out))
    with open(out, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
    print(f"已导出 {len(accounts)} 个账号 → {out}")
    if skipped:
        print("跳过：" + "；".join(f"{name}（{reason}）" for name, reason in skipped))
    print("接下来：把文件交给一人公司工作台 → 网关 → 导入导出 → 上传 JSON 导入。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
