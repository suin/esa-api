## [3.0.1](https://github.com/suin/esa-api/compare/v3.0.0...v3.0.1) (2020-06-22)


### Bug Fixes

* 🐛 sample code bugs in README.md ([fc07a08](https://github.com/suin/esa-api/commit/fc07a08b23d980872ed56dd3582fcdaff1fd0a8a))

# [3.0.0](https://github.com/suin/esa-api/compare/v2.2.0...v3.0.0) (2020-06-22)


### Features

* 🎸 escape sharps and slashes in post name to entity refs ([ced895d](https://github.com/suin/esa-api/commit/ced895d1253ac5ecb2116818ef83b34a82df3f20)), closes [#35](https://github.com/suin/esa-api/issues/35) [#47](https://github.com/suin/esa-api/issues/47) [#35](https://github.com/suin/esa-api/issues/35) [#47](https://github.com/suin/esa-api/issues/47)


### BREAKING CHANGES

* 🧨 扱っているデータによって互換性がなくなりました。記事タイトルに`#`や`/`を含む記事を扱っている場合、処理の結果が変わってくるはずです。

# [2.2.0](https://github.com/suin/esa-api/compare/v2.1.0...v2.2.0) (2020-06-22)


### Features

* 🎸 support POST /v1/teams/:team_name/posts ([a70acfd](https://github.com/suin/esa-api/commit/a70acfdf191ca24742571d9958b634ea2c85564a))

# [2.1.0](https://github.com/suin/esa-api/compare/v2.0.0...v2.1.0) (2020-06-22)


### Features

* 🎸 support PATCH /v1/teams/:team_name/posts/:post_number ([681b8ad](https://github.com/suin/esa-api/commit/681b8ade4ef1de3fed44a10d7a8a1bf774d24013))

# [2.0.0](https://github.com/suin/esa-api/compare/v1.1.0...v2.0.0) (2020-06-19)


### Features

* 🎸 treat 404 error on getPost() as a non-error path ([7f612fb](https://github.com/suin/esa-api/commit/7f612fb7ffb0bc6a8b5d1ca9d71e34dd6d271990))


### BREAKING CHANGES

* 🧨 getPost()の戻り値の型に下位互換性が無くなりました。

# [1.1.0](https://github.com/suin/esa-api/compare/v1.0.0...v1.1.0) (2020-06-17)


### Features

* 🎸 support GET /v1/teams/:team_name/posts/:post_number ([ac663a3](https://github.com/suin/esa-api/commit/ac663a3750f869b1dd88e229bc635e146ea35a90))

# 1.0.0 (2020-06-17)


### Features

* 🎸 implement it! ([16f2c5c](https://github.com/suin/esa-api/commit/16f2c5c936ea85b6e334b8e99d6f399a37cf98ec))
