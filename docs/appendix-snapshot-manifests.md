# Appendix — Snapshot Manifests (manual, repo belum git)

Hash SHA-256 atas bytes aktual; verifikasi Max + Rocky + Tara silang. Keterbatasan: tanpa VCS, manifest ini adalah satu-satunya bukti identitas snapshot (audit B3/M8) — setelah git diinisialisasi, commit hash menggantikan fungsi ini.

## SNAP-W-20261017-001-1 - baseline (81 file)

Manifest penuh baseline (81 entri hash) tersimpan pada log sesi workflow 17 Okt 2026, tidak diduplikasi di sini. Entri kunci yang terlibat perubahan berikutnya dapat dilacak lewat dua manifest di bawah.

## SNAP-W-20261017-001-2 — pasca T-001 (11 file berubah)

```
804e4fe8afc6ed7db0c6852eaf8e125970e47e7ffc3b3b28b1d8951224501d5d  package.json
b40d76f4369de93b21833354972e8c1ab694018b6f9362037e55c63bb3b1efdc  config/database.ts
32cd777475bb3ca192d84fcb20df9553a84da4202d545e6f7e39f92a9796ba70  start/env.ts
2746bf423ff4815d7d38facb4a823f452e71487cc1154a06150d0e62f96d99c0  docker-compose.yml
183775651280fcf7e9068867805371de28af6c3fce6efa560d09b9b31797a3c0  vite.config.ts
c7adb86e4682f415b61fd475c97c96439301391ce62297d55ebc2820df741598  inertia/css/app.css
e864d535e435234c3feb312ff93efca735b287d3b1cc7fb66bf3b4407c6d193d  inertia/pages/home.tsx
1245ba232a8715dedf8b0b0a60c72d8df55c0627d04806e753dd34e9084b95e8  .env.example
6ffadde1b3e645e1930b7e374b95829172aae6ad267fa1d17b32924def643c6e  database/schema.ts
c368ea9d7cd43e640f0aa2df46dba068fc03362d25d5b8c06c39b2fcea014b84  .env
b000ea9f...(388731 byte)  package-lock.json
```

Verifikasi: Max 10/10 cocok; Rocky 11/11 cocok; Tara determinisme build terkonfirmasi.

## SNAP-W-20261017-001-3 — pasca T-004 (SNAPSHOT BERLAKU)

```
dd75c58994aa1ec41663b3c21855e13eda2dfe362eb2ce777fa7ef397760d43c  app/services/roles.ts
eb9d1bf505692899ff2036580846556f83286ce61b7f8e639a0a14fa548c901f  app/services/kode_unik.ts
76fc1673a881a406ba66cb2da46d802602065736d0d59b92fcf1d73d684b8e07  app/models/role.ts
b01a50a2a29837b389438d21688ffded526e8722df833d26c6ba9428aebb090e  app/models/user.ts
127811bd71bad199d8bf847e139eca22bd61f3fa7a5999ca6a3f65ca1952b7a6  app/middleware/role_middleware.ts
e0fe02ee59124dd56525fa424859e8bd04b534bbdf398127b4daa7199026863a  app/controllers/session_controller.ts
fea105b6e6a790b663acce4e4d702390ced9415f520faa08fbde8d9dbf23f238  app/validators/user.ts
7dcb5402db729e587248ce5329c7d449571758070374e2fd29331cd668a37f6d  app/transformers/user_transformer.ts
3aa3e1024fd9b265895295f95741e9fcd7778d2615518fc270e87d45ad533a8d  commands/create_admin.ts
739c5a3ddf61e04357e449b2cb4d69c90638480c57c777b6cf256d1525130d6b  database/migrations/1792200000000_create_roles_table.ts
bea0d3a4867fa587a5d988286e195759a9884ed683037dbdd2995de630018180  database/migrations/1792200000001_alter_users_table.ts
1be7ce0a75daf29ab04208247065de296b1d970cc9a3c3558ade48500cebfe43  database/schema.ts
eb19cc9fa5e69c7d91b19aa7e6acb63d07649159ca920f9b1a46820c8936d918  start/kernel.ts
c1f9ec9df6d65af4b89baaf16aaa85e992963dfbf272949276c686d268fb17b8  start/routes.ts
2edea65989287b7831a9357c451fee624a1e200bd1f4e7eb483408ddad075645  start/env.ts
b85adbe581e9d26091e3262c1501fe29aa92d081086c9d5043239af2136caa5d  inertia/pages/admin.tsx
0e0aea4640fc852cb1e90ec1c080e151882138449b0f54c07f407d04740bd1d2  inertia/pages/auth/login.tsx
04763934acf91ad48537e4c52c4a41eb922cbc846b02581fbae9701006a25284  inertia/layouts/marketing.tsx
0919ea1756b9690a49305511d05465a93e2dfd68d6e3a56975b9116019739e57  tests/helpers/http_client.ts
8f058e998cfe070020a5d87bdd3ba217b52a0f03e49fb8aab6449af2dd1bbf28  tests/unit/kode_unik.spec.ts
96c9f5f9f0d81dab976f6037e39e1f7252a04e31d9dabc80938e91641908e2ed  tests/unit/user_validator.spec.ts
ad4827662560281e06e35c63204035fe88aae011293bf3fdce2237ddad31cb10  tests/functional/auth.spec.ts
cb067c5f41b0e0468c003792b6765d4fc1fa67825f0be2b3e42a1cf3de1f3551  docker-compose.yml
a5f154c0d02e46533fdec987b22fa6249b3076ff43049fc236d4e31ee4834c50  .env.example
9034d77d0f7fc63198fdd138669c9bdc6e8e1fd5cee3a7396e3c4bc1b665f5d1  .env.test
c365428312478c1fc52cd2b6d00a632c4f0f4d72b2eb8d38619cdc830a479459  .env
+ codegen .adonisjs/* (regenerated, non-deliverable)
DELETED (dari baseline): inertia/pages/auth/signup.tsx, app/controllers/new_account_controller.ts
```

Verifikasi: Max 11/11 spot-check cocok + 2 file terhapus terkonfirmasi; Rocky hash 11/11 cocok.
