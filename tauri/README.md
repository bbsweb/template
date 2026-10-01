```
apt update && apt install -y clang llvm lld
rustup target add x86_64-pc-windows-msvc
cargo install --locked cargo-xwin
npm run tauri build -- --no-bundle --runner cargo-xwin --target x86_64-pc-windows-msvc
```