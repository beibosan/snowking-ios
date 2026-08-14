(function () {
  "use strict";
  var depMap = {
    11: { "@o4e/global": "14" },
    13: { "@o4e/bon": "11", "@o4e/global": "14", lz4js: "16" },
    14: {},
    16: { "./util.js": "17", "./xxh32.js": "18" },
    17: {},
    18: { "./util.js": "17" },
  };

  var modules = {}; 
  var cache = {}; 

  function register(id, factory) {
    modules[id] = factory;
  }

  function load(id) {
    if (cache[id]) return cache[id].exports;
    var mod = (cache[id] = { exports: {} });
    var localDeps = depMap[id] || {};
    function localRequire(name) {
      var targetId = localDeps[name] || name;
      if (!modules[targetId]) throw new Error("Cannot find module '" + name + "'");
      return load(targetId);
    }
    modules[id].call(mod.exports, localRequire, mod, mod.exports);
    return mod.exports;
  }
  register("11", function (e, t, n) {
    "use strict";
    (Object.defineProperty(n, "__esModule", {
      value: !0,
    }),
      e("@o4e/global"));

    function o(e, t) {
      ((this.high = e), (this.low = t));
    }
    var r = new TextDecoder(),
      i =
        ((l = _.prototype),
        Object.defineProperty(l, "dataView", {
          get: function () {
            return (
              this._dataView ||
              (this._dataView = new DataView(
                this.data.buffer,
                this.data.byteOffset,
                this.data.byteLength,
              ))
            );
          },
          enumerable: !1,
          configurable: !0,
        }),
        (l.reset = function (e) {
          ((this.data = e), (this.position = 0), (this._dataView = null));
        }),
        (l.validate = function (e) {
          return !(this.position + e > this.data.length && (console.error("read eof"), 1));
        }),
        (l.readUInt8 = function () {
          if (this.validate(1)) return this.data[this.position++];
        }),
        (l.readInt16 = function () {
          if (this.validate(2))
            return this.data[this.position++] | (this.data[this.position++] << 8);
        }),
        (l.readInt32 = function () {
          if (this.validate(4))
            return (
              this.data[this.position++] |
              (this.data[this.position++] << 8) |
              (this.data[this.position++] << 16) |
              (this.data[this.position++] << 24)
            );
        }),
        (l.readInt64 = function () {
          var e = this.readInt32();
          return (e < 0 && (e += 4294967296), e + 4294967296 * this.readInt32());
        }),
        (l.readFloat32 = function () {
          var e;
          if (this.validate(4))
            return ((e = this.dataView.getFloat32(this.position, !0)), (this.position += 4), e);
        }),
        (l.readFloat64 = function () {
          var e;
          if (this.validate(8))
            return ((e = this.dataView.getFloat64(this.position, !0)), (this.position += 8), e);
        }),
        (l.read7BitInt = function () {
          var e,
            t = 0,
            n = 0;
          do {
            if (35 == n) throw Error("Format_Bad7BitInt32");
          } while (((t |= (127 & (e = this.readUInt8())) << n), (n += 7), 0 != (128 & e)));
          return t;
        }),
        (l.readUTF = function () {
          var e = this.read7BitInt();
          return this.readUTFBytes(e);
        }),
        (l.readUint8Array = function (e, t) {
          t = (t = void 0 === t ? !1 : t)
            ? this.data.slice(this.position, this.position + e)
            : this.data.subarray(this.position, this.position + e);
          return ((this.position += e), t);
        }),
        (l.readUTFBytes = function (e) {
          var t;
          return 0 === e
            ? ""
            : this.validate(e)
              ? ((t = this.decodeUTF8(this.data, this.position, e)), (this.position += e), t)
              : void 0;
        }),
        (l.decoderError = function (e) {
          throw new Error("decode error at " + this.position + ": " + e);
        }),
        (l.decodeUTF8 = function (e, t, n) {
          ((t = ~~t), (n = void 0 === n ? e.length : Math.min(e.length, t + n)));
          return t === n ? "" : r.decode(e.subarray(t, n));
        }),
        _),
      a = new Uint8Array(524288),
      s = new TextEncoder(),
      c =
        ((l = h.prototype),
        Object.defineProperty(l, "dataView", {
          get: function () {
            return (
              this._dataView ||
              (this._dataView = new DataView(this.data.buffer, 0, this.data.byteLength))
            );
          },
          enumerable: !1,
          configurable: !0,
        }),
        (l.reset = function () {
          ((this.data = a), (this._dataView = null), (this.position = 0));
        }),
        (l.ensureBuffer = function (e) {
          var t;
          this.position + e > a.byteLength &&
            ((t = a),
            (this.data = a = new Uint8Array(Math.max(~~(1.2 * a.byteLength), this.position + e))),
            a.set(t, 0),
            (this._dataView = null));
        }),
        (l.writeInt8 = function (e) {
          (this.ensureBuffer(1), (this.data[this.position++] = ~~e));
        }),
        (l.writeInt16 = function (e) {
          (this.ensureBuffer(2),
            (this.data[this.position++] = ~~e),
            (this.data[this.position++] = e >> 8));
        }),
        (l.writeInt32 = function (e) {
          (this.ensureBuffer(4),
            (this.data[this.position++] = ~~e),
            (this.data[this.position++] = e >> 8),
            (this.data[this.position++] = e >> 16),
            (this.data[this.position++] = e >> 24));
        }),
        (l.writeInt64 = function (e) {
          (this.writeInt32(e),
            e < 0 ? this.writeInt32(~(-e / 4294967296)) : this.writeInt32(~~(e / 4294967296)));
        }),
        (l.writeFloat32 = function (e) {
          (this.ensureBuffer(4),
            this.dataView.setFloat32(this.position, e, !0),
            (this.position += 4));
        }),
        (l.writeFloat64 = function (e) {
          (this.ensureBuffer(8),
            this.dataView.setFloat64(this.position, e, !0),
            (this.position += 8));
        }),
        (l._write7BitInt = function (e) {
          for (var t = ~~e; 128 <= t; ) ((this.data[this.position++] = 128 | t), (t >>>= 7));
          this.data[this.position++] = t;
        }),
        (l.write7BitInt = function (e) {
          (this.ensureBuffer(5), this._write7BitInt(e));
        }),
        (l._7BitIntLen = function (e) {
          return e < 0 ? 5 : e < 128 ? 1 : e < 16384 ? 2 : e < 2097152 ? 3 : e < 268435456 ? 4 : 5;
        }),
        (l.writeUTF = function (e) {
          var t,
            n,
            o,
            r = e.length;
          0 !== r
            ? (this.ensureBuffer(5 + (r = 6 * r)),
              (o = this.position),
              (this.position += this._7BitIntLen(r)),
              (t = (r = this.position) - o),
              this._writeUTFBytes(e),
              (n = (e = this.position) - r),
              (this.position = o),
              this._write7BitInt(n),
              (o = this.position - o) != t && this.data.copyWithin(r + o - t, r, e),
              (this.position += n))
            : this.write7BitInt(0);
        }),
        (l.writeUint8Array = function (e, t, n) {
          var o = ~~t,
            r = void 0 === n ? e.byteLength : Math.min(e.byteLength, o + n);
          (n = r - o) <= 0 ||
            (this.ensureBuffer(n),
            this.data.set(e.subarray(t, r), this.position),
            (this.position += n));
        }),
        (l.encoderError = function (e) {
          throw new Error("encode error at " + this.position + ": " + e);
        }),
        (l._writeUTFBytes = function (e) {
          e = s.encodeInto(e, this.data.subarray(this.position));
          this.position += e.written;
        }),
        (l.writeUTFBytes = function (e) {
          (this.ensureBuffer(6 * e.length), this._writeUTFBytes(e));
        }),
        (l.getBytes = function (e) {
          return (e = void 0 === e ? !1 : e)
            ? this.data.slice(0, this.position)
            : this.data.subarray(0, this.position);
        }),
        h),
      l =
        (((l = g.prototype).reset = function () {
          (this.dw.reset(), this.strMap.clear());
        }),
        (l.encodeInt = function (e) {
          (this.dw.writeInt8(1), this.dw.writeInt32(e));
        }),
        (l.encodeLong = function (e) {
          (this.dw.writeInt8(2),
            "number" == typeof e
              ? this.dw.writeInt64(e)
              : (this.dw.writeInt32(e.low), this.dw.writeInt32(e.high)));
        }),
        (l.encodeFloat = function (e) {
          (this.dw.writeInt8(3), this.dw.writeFloat32(e));
        }),
        (l.encodeDouble = function (e) {
          (this.dw.writeInt8(4), this.dw.writeFloat64(e));
        }),
        (l.encodeNumber = function (e) {
          ~~e !== e
            ? Math.floor(e) !== e
              ? this.encodeDouble(e)
              : this.encodeLong(e)
            : this.encodeInt(e);
        }),
        (l.encodeString = function (e) {
          var t = this.strMap.get(e);
          void 0 !== t
            ? (this.dw.writeInt8(99), this.dw.write7BitInt(t))
            : (this.dw.writeInt8(5), this.dw.writeUTF(e), this.strMap.set(e, this.strMap.size));
        }),
        (l.encodeBoolean = function (e) {
          (this.dw.writeInt8(6), this.dw.writeInt8(e ? 1 : 0));
        }),
        (l.encodeNull = function () {
          this.dw.writeInt8(0);
        }),
        (l.encodeDateTime = function (e) {
          (this.dw.writeInt8(10), this.dw.writeInt64(e.getTime()));
        }),
        (l.encodeBinary = function (e) {
          (this.dw.writeInt8(7), this.dw.write7BitInt(e.byteLength), this.dw.writeUint8Array(e));
        }),
        (l.encodeArray = function (e) {
          (this.dw.writeInt8(9), this.dw.write7BitInt(e.length));
          for (var t = e.length, n = 0; n < t; ++n) this.encode(e[n]);
        }),
        (l.encodeMap = function (e) {
          var n = this;
          (this.dw.writeInt8(8),
            this.dw.write7BitInt(e.size),
            e.forEach(function (e, t) {
              (n.encode(t), n.encode(e));
            }));
        }),
        (l.encodeObject = function (e) {
          this.dw.writeInt8(8);
          var t,
            n = [];
          for (t in e)
            if (!t.startsWith("$")) {
              switch (typeof e[t]) {
                case "function":
                case "undefined":
                  continue;
              }
              n.push(t);
            }
          this.dw.write7BitInt(n.length);
          for (var o = 0, r = n; o < r.length; o++) {
            var i = r[o];
            (this.encode(i), this.encode(e[i]));
          }
        }),
        (l.encode = function (e) {
          if (null != e)
            switch (e.constructor) {
              case Number:
                return void this.encodeNumber(e);
              case Boolean:
                return void this.encodeBoolean(e);
              case String:
                return void this.encodeString(e);
              case o:
                return void this.encodeLong(e);
              case Array:
                return void this.encodeArray(e);
              case Map:
                return void this.encodeMap(e);
              case Date:
                return void this.encodeDateTime(e);
              case Uint8Array:
                return void this.encodeBinary(e);
              default:
                if ("object" != typeof e) return void this.encodeNull();
                this.encodeObject(e);
            }
          else this.encodeNull();
        }),
        (l.getBytes = function (e) {
          return this.dw.getBytes((e = void 0 === e ? !1 : e));
        }),
        g),
      u =
        (((u = p.prototype).reset = function (e) {
          (this.dr.reset(e), (this.strArr.length = 0));
        }),
        (u.decode = function () {
          switch (this.dr.readUInt8()) {
            default:
              return null;
            case 1:
              return this.dr.readInt32();
            case 2:
              return this.dr.readInt64();
            case 3:
              return this.dr.readFloat32();
            case 4:
              return this.dr.readFloat64();
            case 5:
              var e = this.dr.readUTF();
              return (this.strArr.push(e), e);
            case 6:
              return 1 == this.dr.readUInt8();
            case 7:
              return this.dr.readUint8Array(this.dr.read7BitInt(), !1);
            case 8:
              for (var t = this.dr.read7BitInt(), n = {}, o = 0; o < t; o++) {
                var r = this.decode(),
                  i = this.decode();
                n[r] = i;
              }
              return n;
            case 9:
              for (var t = this.dr.read7BitInt(), a = new Array(t), o = 0; o < t; o++)
                a[o] = this.decode();
              return a;
            case 10:
              return new Date(this.dr.readInt64());
            case 99:
              return this.strArr[this.dr.read7BitInt()];
          }
        }),
        p),
      d = new l(),
      f = new u();

    function p() {
      ((this.dr = new i(null)), (this.strArr = []));
    }

    function g() {
      ((this.dw = new c()), (this.strMap = new Map()));
    }

    function h() {
      ((this.position = 0), (this.data = a));
    }

    function _(e) {
      ((this.position = 0), this.reset(e));
    }
    try {
      globalThis.bon = n;
    } catch (e) {}
    ((n.BonDecoder = u),
      (n.BonEncoder = l),
      (n.DataReader = i),
      (n.DataWriter = c),
      (n.Int64 = o),
      (n.decode = function (e) {
        var t = f;
        return (t.reset(e), t.decode());
      }),
      (n.encode = function (e, t) {
        void 0 === t && (t = !0);
        var n = d;
        return (n.reset(), n.encode(e), n.getBytes(t));
      }));
  });
  register("13", function (e, G, f) {
    "use strict";
    (Object.defineProperty(f, "__esModule", {
      value: !0,
    }),
      e("@o4e/global"));
    var t = e("lz4js"),
      i = e("@o4e/bon");
    var t =
        (e = t) && "object" == typeof e && "default" in e
          ? e
          : {
              default: e,
            },
      d = {
        rpc: {
          connectTimeoutTotal: 1e4,
          connectTimeoutOnce: 3e3,
          connectRetryMinInterval: 1e3,
          heartbeatInterval: 5e3,
          heartbeatTimeout: 1e4,
          httpTimeout: 0,
          maxSendOnce: 10,
          maxRecvOnce: 10,
          networkState: function () {
            return 1;
          },
        },
      },
      x = [];

    function U(e) {
      x.push(e);
    }

    function H(e) {
      var t;
      return (
        e &&
          (((t = Object.assign({}, d, e)).rpc = Object.assign(d.rpc, e.rpc)), Object.assign(d, t)),
        x.reduce(function (e, t) {
          return e.then(function () {
            return t(d);
          });
        }, Promise.resolve())
      );
    }
    var k = new TextEncoder(),
      n = new Uint8Array(100);

    function o(e) {
      for (var t = 0, n = 0; n < e.length; n++) t = ~~(131 * t + e[n]);
      return 2147483647 & t;
    }

    function F(e) {
      var t = 6 * e.length,
        t = (n.length < t && (n = new Uint8Array(t)), k.encodeInto(e, n));
      return o(n.subarray(0, t.written));
    }

    function j(e) {
      return o(
        e.split("").map(function (e) {
          return e.codePointAt(0);
        }),
      );
    }

    function K(e) {
      e = W(e);
      for (var t = 2 + ~~(248 * Math.random()), n = Math.min(e.length, 100); 0 <= --n; ) e[n] ^= t;
      return (
        (e[0] = 112),
        (e[1] = 108),
        (e[2] =
          (170 & e[2]) |
          (((t >> 7) & 1) << 6) |
          (((t >> 6) & 1) << 4) |
          (((t >> 5) & 1) << 2) |
          (((t >> 4) & 1) << 0)),
        (e[3] =
          (170 & e[3]) |
          (((t >> 3) & 1) << 6) |
          (((t >> 2) & 1) << 4) |
          (((t >> 1) & 1) << 2) |
          (((t >> 0) & 1) << 0)),
        e
      );
    }

    function V(e) {
      for (
        var t =
            (((e[2] >> 6) & 1) << 7) |
            (((e[2] >> 4) & 1) << 6) |
            (((e[2] >> 2) & 1) << 5) |
            (((e[2] >> 0) & 1) << 4) |
            (((e[3] >> 6) & 1) << 3) |
            (((e[3] >> 4) & 1) << 2) |
            (((e[3] >> 2) & 1) << 1) |
            (((e[3] >> 0) & 1) << 0),
          n = Math.min(100, e.length);
        2 <= --n;
      )
        e[n] ^= t;
      return ((e[0] = 4), (e[1] = 34), (e[2] = 77), (e[3] = 24), Y(e));
    }
    var W = t.default.compress,
      Y = t.default.decompress,
      q =
        (((e = Q.prototype).register = function (e, t, n, o) {
          this.registerState({
            state: e,
            enter: t,
            exit: n,
            update: o,
          });
        }),
        (e.registerState = function (e) {
          this.states[e.state] = e;
        }),
        (e.changeStateNextFrame = function (e) {
          this.nextState = e;
        }),
        (e.changeState = function (e) {
          (this.state && this.state.exit && this.state.exit(),
            (this.preState = this.curState),
            (this.curState = e),
            (this.state = this.states[e]),
            (this.firstUpdate = !0),
            this.state && this.state.enter && this.state.enter());
        }),
        (e.update = function () {
          var e = this.nextState;
          (void 0 !== e && ((this.nextState = void 0), this.changeState(e)),
            this.state && this.state.update && this.state.update(),
            (this.firstUpdate = !1));
        }),
        Q);

    function Q() {
      ((this.states = {}), (this.nextState = void 0));
    }

    function X(t) {
      return new Promise(function (e) {
        setTimeout(e, t);
      });
    }

    function z(e) {
      var t = ~~(4294967295 * Math.random()),
        n = new Uint8Array(e.length + 4);
      ((n[0] = 255 & t),
        (n[1] = (t >> 8) & 255),
        (n[2] = (t >> 16) & 255),
        (n[3] = (t >> 24) & 255),
        n.set(e, 4));
      for (var o = 2 + ~~(248 * Math.random()), r = n.length; 0 <= --r; ) n[r] ^= o;
      return (
        (n[0] = 112),
        (n[1] = 120),
        (n[2] =
          (170 & n[2]) |
          (((o >> 7) & 1) << 6) |
          (((o >> 6) & 1) << 4) |
          (((o >> 5) & 1) << 2) |
          (((o >> 4) & 1) << 0)),
        (n[3] =
          (170 & n[3]) |
          (((o >> 3) & 1) << 6) |
          (((o >> 2) & 1) << 4) |
          (((o >> 1) & 1) << 2) |
          (((o >> 0) & 1) << 0)),
        n
      );
    }

    function J(e) {
      for (
        var t =
            (((e[2] >> 6) & 1) << 7) |
            (((e[2] >> 4) & 1) << 6) |
            (((e[2] >> 2) & 1) << 5) |
            (((e[2] >> 0) & 1) << 4) |
            (((e[3] >> 6) & 1) << 3) |
            (((e[3] >> 4) & 1) << 2) |
            (((e[3] >> 2) & 1) << 1) |
            (((e[3] >> 0) & 1) << 0),
          n = e.length;
        4 <= --n;
      )
        e[n] ^= t;
      return e.subarray(4);
    }
    var Z = 0,
      r = 0,
      $ = !1,
      ee =
        (Object.defineProperty(a, "serverTime", {
          get: function () {
            return a.syncServerTime + Date.now() - Z;
          },
          set: function (e) {
            var t;
            e &&
              ((a.lastServerTime = e),
              $ ||
                (($ = !0),
                setInterval(function () {
                  ((r += 1e3), Math.abs(r - a.serverTime) < 2e3 && (r = a.serverTime));
                }, 1e3)),
              (t = a.serverTime),
              (r =
                0 < a.syncServerTime && e < t && t - e < 1e3
                  ? t
                  : ((a.syncServerTime = e), (Z = Date.now()), e)));
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(a, "serverTimeIsValid", {
          get: function () {
            return 0 < a.syncServerTime && Math.abs(r - a.serverTime) < 1e4;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (a.isServerTimeValidate = function () {
          return a.serverTimeIsValid;
        }),
        (a.syncServerTime = 0),
        (a.lastServerTime = 0),
        a);

    function a() {}

    function p(e) {
      return JSON.stringify(e, function (e, t) {
        var n;
        return t instanceof Uint8Array
          ? "binary(" + t.length + ")"
          : t instanceof Map
            ? ((n = {}),
              t.forEach(function (e, t) {
                n[t] = e;
              }),
              n)
            : t;
      });
    }
    ((f.HttpMethod = void 0),
      ((t = f.HttpMethod || (f.HttpMethod = {})).GET = "GET"),
      (t.POST = "POST"),
      (f.HttpResponseType = void 0),
      ((e = f.HttpResponseType || (f.HttpResponseType = {})).TEXT = "text"),
      (e.ARRAY_BUFFER = "arraybuffer"));
    ((t = oe.prototype),
      Object.defineProperty(t, "response", {
        get: function () {
          return this.$xhr
            ? null != this.$xhr.response
              ? this.$xhr.response
              : "text" == this.$responseType
                ? this.$xhr.responseText
                : "arraybuffer" == this.$responseType && /msie 9.0/i.test(navigator.userAgent)
                  ? globalThis.convertResponseBodyToText(this.$xhr.responseBody)
                  : null
            : null;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "responseType", {
        get: function () {
          return this.$responseType;
        },
        set: function (e) {
          this.$responseType = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(t, "withCredentials", {
        get: function () {
          return this.$withCredentials;
        },
        set: function (e) {
          this.$withCredentials = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (t.open = function (e, t) {
        var n = this,
          e =
            (void 0 === t && (t = f.HttpMethod.GET),
            (this.$url = e),
            (this.$method = t),
            this.$xhr && (this.$xhr.abort(), (this.$xhr = null)),
            new XMLHttpRequest());
        (e.addEventListener("load", this.onload.bind(this)),
          e.addEventListener("error", function (e) {
            return n.onError("string" == typeof e ? e : "unkown");
          }),
          (e.ontimeout = function () {
            return n.onError("timeout");
          }),
          e.open(this.$method, this.$url, !0),
          (this.$xhr = e));
      }),
      (t.send = function (o) {
        var r = this;
        return new Promise(function (e, t) {
          if (
            ((r.resolve = e),
            (r.reject = t),
            null != r.$responseType && (r.$xhr.responseType = r.$responseType),
            null != r.$withCredentials && (r.$xhr.withCredentials = r.$withCredentials),
            r.headerObj)
          )
            for (var n in r.headerObj) r.$xhr.setRequestHeader(n, r.headerObj[n]);
          ((r.$xhr.timeout = r.timeout), r.$xhr.send(o));
        });
      }),
      (t.abort = function () {
        this.$xhr && this.$xhr.abort();
      }),
      (t.getAllResponseHeaders = function () {
        return this.$xhr ? this.$xhr.getAllResponseHeaders() || "" : null;
      }),
      (t.setRequestHeader = function (e, t) {
        (this.headerObj || (this.headerObj = {}), (this.headerObj[e] = t));
      }),
      (t.getResponseHeader = function (e) {
        return this.$xhr ? this.$xhr.getResponseHeader(e) || "" : null;
      }),
      (t.onload = function () {
        400 <= this.$xhr.status ? this.onError(this.$xhr.status + "") : this.onSuccess();
      }),
      (t.onSuccess = function () {
        this.resolve && (this.resolve(this.response), (this.resolve = null), (this.reject = null));
      }),
      (t.onError = function (e) {
        this.reject && (this.reject(e), (this.reject = null), (this.resolve = null));
      }));
    var te = oe,
      ne = function (e, t) {
        return (ne =
          Object.setPrototypeOf ||
          ({
            __proto__: [],
          } instanceof Array
            ? function (e, t) {
                e.__proto__ = t;
              }
            : function (e, t) {
                for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
              }))(e, t);
      };

    function oe() {
      ((this.timeout = 0),
        (this.$responseType = f.HttpResponseType.ARRAY_BUFFER),
        (this.$url = ""),
        (this.$method = ""));
    }

    function re(e, t) {
      if ("function" != typeof t && null !== t)
        throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

      function n() {
        this.constructor = e;
      }
      (ne(e, t),
        (e.prototype = null === t ? Object.create(t) : ((n.prototype = t.prototype), new n())));
    }

    function ie() {}

    function ae(e, t) {
      return d.debug ? (e = console[e]).bind.apply(e, [console].concat(t())) : ie;
    }

    function g(e) {
      return ae("debug", e);
    }
    ((e = ge.prototype),
      Object.defineProperty(e, "isEmpty", {
        get: function () {
          if (this.listeners)
            for (var e in this.listeners)
              if (this.listeners[e] && 0 < this.listeners[e].length) return !1;
          return !0;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (e._on = function (e, t, n, o) {
        var r = this.listeners || (this.listeners = {});
        (r[e] || (r[e] = [])).push({
          type: e,
          listener: t,
          thisObj: n,
          once: o,
        });
      }),
      (e.on = function (e, t, n) {
        this._on(e, t, n, !1);
      }),
      (e.once = function (e, t, n) {
        this._on(e, t, n, !0);
      }),
      (e.off = function (e, t, n) {
        var o = this.listeners && this.listeners[e];
        if (o && 0 !== o.length)
          for (var r = o.length; 0 <= --r; ) {
            var i = o[r];
            i && i.listener === t && i.thisObj === n && (o[r] = null);
          }
      }),
      (e.emit = function (e, t) {
        var n = this.listeners && this.listeners[e];
        if (n && 0 !== n.length)
          for (var o, r = 0; r < n.length; r++) {
            var i = n[r];
            if (i) {
              if (
                ((o = o || {
                  target: i.thisObj,
                  type: e,
                  data: t,
                }),
                i.once && n.splice(r--, 1),
                i.listener.call(i.thisObj, o),
                o.cancel)
              )
                break;
            } else n.splice(r--, 1);
          }
      }),
      (e.clear = function (e) {
        this.listeners && (e ? delete this.listeners[e] : (this.listeners = void 0));
      }));
    var s = ge,
      l = "e_msg",
      c = "e_preconnect",
      u = "e_connected",
      e =
        (((t = pe.prototype).addSyncCommand = function (e) {
          this.syncCommands.add(e.toLowerCase());
        }),
        (t.setRoot = function (e) {
          this.root = e;
        }),
        pe),
      se = new e(),
      t =
        ((fe.prototype.doReceiveMsg = function (e) {
          e.time && (ee.serverTime = e.time);
          var t = this.syncData;
          if (t.root && (t.syncAllCommand || t.syncCommands.has(e.cmd)))
            for (var n in e.rawData) {
              var o = t.root[n];
              o && o.setValue && o.setValue(e.rawData[n]);
            }
          try {
            (this.events.emit(e.cmd, e), this.events.emit(l, e));
          } catch (e) {
            console.error(e);
          }
        }),
        fe),
      ce = new Map([
        [Number, "Number"],
        [String, "String"],
        [Boolean, "Bool"],
        [Date, "Date"],
        [Uint8Array, "Bytes"],
        [y, "Any"],
      ]),
      le = "ti",
      ue = new Map(),
      de = {
        next: new Map(),
      };

    function fe() {
      ((this.syncData = se), (this.events = new s()));
    }

    function pe() {
      ((this.syncCommands = new Set(["respsync"])), (this.syncAllCommand = !0));
    }

    function ge() {}

    function he(e) {
      return ue.get(e);
    }

    function h(e) {
      return null == e ? _(y) : f.isArray(e) ? _(Array) : f.isMap(e) ? _(Map) : _(e.constructor);
    }
    var _e = [void 0];

    function me(e) {
      var t = e[le];
      return t && t.ctor === e && t.ti;
    }

    function Ee(e, t) {
      e[le] = {
        ctor: e,
        ti: t,
      };
    }

    function _(e) {
      if (!Array.isArray(e)) {
        if (e) {
          var t = me(e);
          if (t) return t;
        }
        ((_e[0] = e), (e = _e));
      }
      return (function e(t, n) {
        if (!(n >= t.length)) {
          var o = t[n] || Object,
            r = me(o);
          if (r) return r;
          var i = ve(de, o);
          if (o === Map || o === Array)
            for (var a = n + 1, s = t.length; a < s; a++) i = ve(i, t[a]);
          if (!i.leaf) {
            var c = (i.leaf = new ye());
            switch (o) {
              case Number:
              case String:
              case Boolean:
              case Date:
              case Uint8Array:
              case y:
                ((c.ctor = i.ctor = o), (c.name = c.typeCode = ce.get(o)), Ee(o, c));
                break;
              case Map:
                ((c.ctor = i.ctor = Map),
                  (c.typeCode = "Map"),
                  (c.eTypes = [
                    n + 1 >= t.length ? _(y) : e(t, n + 1),
                    n + 2 >= t.length ? _(y) : e(t, n + 2),
                  ]),
                  (c.name = "Map<" + c.eTypes[0].name + "," + c.eTypes[1].name + ">"));
                break;
              case Array:
                ((c.ctor = i.ctor = Array),
                  (c.typeCode = "Array"),
                  (c.eTypes = [n + 1 >= t.length ? _(y) : e(t, n + 1)]),
                  (c.name = "Array<" + c.eTypes[0].name + ">"));
                break;
              default:
                ((c.ctor = i.ctor = o),
                  (c.typeCode = "Object"),
                  o !== Object &&
                    ((c.base = _(Object.getPrototypeOf(i.ctor.prototype).constructor)),
                    "Object" === c.typeCode) &&
                    c.base &&
                    "Class" === c.base.typeCode &&
                    (Re(o), (c.typeCode = "Class")),
                  (c.name = o.name),
                  Ee(o, c));
            }
            ue.set(c.name, c);
          }
          return i.leaf;
        }
      })(e, 0);
    }

    function ve(e, t) {
      var n = e.next.get(t);
      return (
        n ||
          ((n = {
            next: new Map(),
          }),
          e.next.set(t, n)),
        n
      );
    }
    (((S = Ce.prototype).addProp = function (e) {
      (this.ownProperties || (this.ownProperties = new Map()),
        this.ownProperties.set(e.name, e),
        (this.allPropertiesList = void 0),
        (this.allPropertiesMap = void 0));
    }),
      (S.getOwnProp = function (e) {
        var t;
        return null == (t = this.ownProperties) ? void 0 : t.get(e);
      }),
      (S.hasOwnProp = function (e) {
        var t;
        return null == (t = this.ownProperties) ? void 0 : t.has(e);
      }),
      (S.createInstance = function () {
        switch (this.typeCode) {
          case "Bool":
            return !1;
          case "String":
            return "";
          case "Array":
          case "Class":
          case "Map":
          case "Object":
            return new this.ctor();
          case "Date":
            return new Date(0);
          case "Number":
            return 0;
          default:
            return;
        }
      }),
      (S.ensureAll = function () {
        var e, t;
        this.allPropertiesMap ||
          ((t = this.allPropertiesMap = new Map()),
          this.base &&
            this.base.getAllProps().forEach(function (e) {
              t.set(e.name, e);
            }),
          null != (e = this.ownProperties) &&
            e.forEach(function (e) {
              t.set(e.name, e);
            }));
      }),
      (S.getProp = function (e) {
        return (this.ensureAll(), this.allPropertiesMap.get(e));
      }),
      (S.getAllProps = function () {
        var t = this.allPropertiesList;
        return (
          t ||
            (this.ensureAll(),
            (this.allPropertiesList = t = []),
            this.allPropertiesMap.forEach(function (e) {
              return t.push(e);
            })),
          t
        );
      }));
    var ye = Ce,
      m = function () {};

    function Ce() {}

    function E(o) {
      return function (e, t) {
        var e = Ae(e.constructor),
          n = new m();
        ((n.name = t), (n.type = _(o)), e.addProp(n));
      };
    }

    function Se(e, t) {
      switch (e) {
        case 1:
          return E(t);
        case 2:
          return E(Oe(t || y));
        case 3:
          return E(C(Number, t || y));
        case 5:
          return E(C(String, t || y));
        case 4:
          return E(Date);
        default:
          return E(y);
      }
    }

    function Ae(e) {
      e = _(e);
      return ((e.typeCode = "Class"), e);
    }

    function Te(n) {
      return function (e) {
        var t = Ae(e);
        n && ((e._className = t.name = n), ue.set(n, t));
      };
    }
    var Ie = new Set([Object]);

    function v(e) {
      var t, n, o;
      e &&
        !Ie.has(e) &&
        (Ie.add(e),
        v(null == (t = (n = Ae(e)).base) ? void 0 : t.ctor),
        (o = new e()),
        Object.keys(o)
          .filter(function (e) {
            return !e.startsWith("$") && !e.startsWith("_");
          })
          .forEach(function (e) {
            var t;
            n.getProp(e) || (((t = new m()).name = e), (t.type = h(o[e])), n.addProp(t));
          }));
    }

    function Re(e) {
      if (void 0 === e)
        return function (e) {
          v(e);
        };
      Array.isArray(e)
        ? e.forEach(function (e) {
            v(e);
          })
        : v(e);
    }

    function y() {}

    function Oe(e) {
      return Array.isArray(e) ? [Array].concat(e) : [Array, e];
    }

    function C(e, t) {
      return Array.isArray(t) ? [Map, e].concat(t) : [Map, e, t];
    }

    function we(e) {
      f.isArray = e;
    }

    function be(e) {
      f.isMap = e;
    }
    ((f.isArray = Array.isArray),
      (f.isMap = function (e) {
        return e.constructor === Map;
      }));
    (((S = Ne.prototype).toJSON = function () {
      return A(this);
    }),
      (S.reset = function () {
        T(this);
      }),
      (S.setValue = function (e) {
        Le(e, this, h(this));
      }),
      (S.setHistoryValue = function (e, t) {
        (this.$history || (this.$history = new Map()), this.$history.set(e, t));
      }));
    var S = Ne;

    function Ne() {}

    function A(t) {
      var n = h(t);
      switch (n.typeCode) {
        default:
          return t;
        case "Date":
          return t.getTime();
        case "Array":
          var o = [];
          return (
            t.forEach(function (e) {
              o.push(A(e));
            }),
            o
          );
        case "Map":
          var r = {};
          return (
            t.forEach(function (e, t) {
              r[t + ""] = A(e);
            }),
            r
          );
        case "Object":
          var i = {};
          return (
            Object.keys(t).forEach(function (e) {
              i[e] = A(t[e]);
            }),
            i
          );
        case "Class":
          var a = {};
          return (
            Object.keys(t).forEach(function (e) {
              n.getProp(e) && (a[e] = A(t[e]));
            }),
            a
          );
      }
    }

    function T(n) {
      var e = h(n);
      switch (e.typeCode) {
        default:
          return e.createInstance();
        case "Map":
          return (n.clear(), n);
        case "Array":
          return ((n.length = 0), n);
        case "Date":
          return (n.setTime(0), n);
        case "Object":
          return (
            Object.keys(n).forEach(function (e) {
              delete n[e];
            }),
            n
          );
        case "Class":
          return (
            e.getAllProps().forEach(function (e) {
              var t = n[e.name];
              n[e.name] = t ? T(t) : e.type.createInstance();
            }),
            n
          );
      }
    }

    function Le(e, t, n) {
      var o, r;
      for (r in e) {
        var i,
          a = e[r],
          s = n.getProp(r);
        s &&
          ((i = t[r]),
          s.recordFlag && null != (o = t.setHistoryValue) && o.call(t, r, i),
          (t[r] = I(a, i, s.type)));
      }
    }

    function I(e, t, n) {
      switch ((n = n || h(t)).typeCode) {
        case "Number":
          return +e || 0;
        case "Bool":
          return !!e;
        case "String":
          return e + "";
        case "Bytes":
          return e instanceof Uint8Array ? e : void 0;
        case "Date":
          return "number" == typeof e
            ? new Date(e)
            : e instanceof Date
              ? e
              : Array.isArray(e)
                ? new Date(1e3 * e[0] + e[1] / 1e6)
                : new Date(0);
        case "Array":
          var o, r;
          return Array.isArray(e)
            ? ((o = []),
              (r = n.eTypes[0]),
              e.forEach(function (e) {
                o.push(I(e, void 0, r));
              }),
              o)
            : [];
        case "Map":
          if (!e) return t && t.constructor === Map ? (t.clear(), t) : new Map();
          ((l = t) && f.isMap(l)) || (l = new Map());
          var i = n.eTypes[0],
            a = n.eTypes[1];
          for (c in e) {
            var s = e[c];
            ((c = I(c, void 0, i)), null == s ? l.delete(c) : l.set(c, I(s, l.get(c), a)));
          }
          return l;
        case "Class":
          return e
            ? ((l = t) && l.constructor === n.ctor
                ? n.key && e[n.key] && l[n.key] !== e[n.key] && T(l)
                : (l = new n.ctor()),
              "function" == typeof l.setValue ? l.setValue(e) : Le(e, l, n),
              l)
            : t
              ? T(t)
              : n.createInstance();
        case "Object":
          if (!e) return n.createInstance();
          var c,
            l = (l = t) || new n.ctor();
          for (c in e) l[c] = I(e[c], l[c]);
          return l;
        case "Any":
          var u, d;
          return null == t
            ? e
            : ((u = h(e)),
              (d = h(t)),
              u.typeCode === d.typeCode ||
              ("Object" === u.typeCode && ("Class" === d.typeCode || "Map" == d.typeCode))
                ? I(e, t)
                : e);
        default:
          return;
      }
    }

    function Me(n) {
      return function (e, t) {
        e = _(e.constructor).getOwnProp(t);
        e && (e.recordFlag = n);
      };
    }

    function Pe(t) {
      return function (e) {
        _(e).key = t;
      };
    }
    ((D = De.prototype),
      Object.defineProperty(D, "sendMsg", {
        get: function () {
          return this._sendMsg;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(D, "seq", {
        get: function () {
          return this._raw.seq;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(D, "resp", {
        get: function () {
          return this._raw.resp;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(D, "ack", {
        get: function () {
          return this._raw.ack;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(D, "cmd", {
        get: function () {
          return this._raw.cmd && this._raw.cmd.toLowerCase();
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(D, "code", {
        get: function () {
          return ~~this._raw.code;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(D, "error", {
        get: function () {
          return this._raw.error;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(D, "time", {
        get: function () {
          return this._raw.time;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(D, "body", {
        get: function () {
          return this._raw.body;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(D, "rawData", {
        get: function () {
          return void 0 !== this._rawData || void 0 === this.body
            ? this._rawData
            : (this._rawData = i.decode(this.body));
        },
        enumerable: !1,
        configurable: !0,
      }),
      (D.setDataType = function (e) {
        return ((this._t = e && _(e)), this);
      }),
      (D.setSendMsg = function (e) {
        return ((this._sendMsg = e), this.setDataType(e.respType), this);
      }),
      (D.getData = function (e) {
        var t, n;
        return (
          void 0 === this._data &&
            void 0 !== this.rawData &&
            ((t = this._t),
            e || t || console.error("娌℃湁璁剧疆鍝嶅簲鏁版嵁绫诲瀷"),
            e &&
              t &&
              e.constructor != t.ctor &&
              ((n = h(e)),
              ae("error", function () {
                return ["getData type not match, " + n.name + " != " + t.name];
              })(),
              (t = n)),
            (this._data = I(this.rawData, e, t))),
          this._data
        );
      }),
      (D.toLogString = function () {
        var e = Object.assign({}, this._raw);
        return (delete e.body, (e.data = this.rawData), (e.rtt = this.rtt), p(e));
      }));
    var R = De;

    function De(e) {
      ((this.rtt = 0), (e.cmd = e.cmd && e.cmd.toLowerCase()), (this._raw = e));
    }
    ((f.Encoding = void 0),
      ((D = f.Encoding || (f.Encoding = {})).LX = "lx"),
      (D.X = "x"),
      (D.XTM = "xtm"),
      (D.NULL = ""));
    var O = globalThis.XXTEA && new globalThis.XXTEA();

    function w(e, t) {
      e = i.encode(e, !1);
      return (e = t.encrypt(e)).buffer.byteLength === e.length
        ? e.buffer
        : e.buffer.slice(0, e.length);
    }

    function b(e, t) {
      t = t.decrypt(new Uint8Array(e));
      return new R(i.decode(t));
    }
    var Be = new Map();

    function Ge(e, t) {
      Be.set(e, t);
    }
    ((D = Ge)("lx", {
      encrypt: K,
      decrypt: V,
    }),
      D("x", {
        encrypt: z,
        decrypt: J,
      }),
      D("xtm", {
        encrypt: function (e) {
          return O
            ? O.encryptMod({
                data: e.buffer,
                length: e.length,
              })
            : e;
        },
        decrypt: function (e) {
          return O
            ? O.decryptMod({
                data: e.buffer,
                length: e.length,
              })
            : e;
        },
      }));
    var xe = {
      encrypt: function (e) {
        return e.slice();
      },
      decrypt: function (e) {
        return (
          4 < e.length && 112 == e[0] && 108 == e[1]
            ? (e = N("lx").decrypt(e))
            : 4 < e.length && 112 == e[0] && 120 == e[1]
              ? (e = N("x").decrypt(e))
              : 3 < e.length && 112 == e[0] && 116 == e[1] && (e = N("xtm").decrypt(e)),
          e
        );
      },
    };

    function N(e) {
      return Be.get(e) || xe;
    }
    ((f.ErrorCode = void 0),
      ((D = f.ErrorCode || (f.ErrorCode = {}))[(D.TIMEOUT = -2)] = "TIMEOUT"),
      (D[(D.UNKNOWN = -1)] = "UNKNOWN"),
      (D[(D.NEED_AUTH = -3)] = "NEED_AUTH"),
      (D[(D.AUTH_ERROR = -4)] = "AUTH_ERROR"),
      (D[(D.CANCELED = -5)] = "CANCELED"),
      (D[(D.SKIP = 6)] = "SKIP"));
    (re(je, (Ue = t)),
      (D = je.prototype),
      Object.defineProperty(D, "token", {
        get: function () {
          return this.defaultHeaders["O4e-Token"];
        },
        set: function (e) {
          this.defaultHeaders["O4e-Token"] = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(D, "encoding", {
        get: function () {
          return this.defaultHeaders["O4e-Encoding"];
        },
        set: function (e) {
          ((this.defaultHeaders["O4e-Encoding"] = e), (this.enc = N(e)));
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(D, "version", {
        get: function () {
          return this.defaultHeaders["O4e-Version"];
        },
        set: function (e) {
          this.defaultHeaders["O4e-Version"] = e;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (D.onSendError = function (e) {
        (console.error(e),
          g(function () {
            return ["%c<<<< http recieve error: " + e, "color:#00afaf;font-weight:bold;"];
          })());
        var t = new R({
          code: f.ErrorCode.UNKNOWN,
          error: e || "unkown",
        });
        return (this.doReceiveMsg(t), t);
      }),
      (D.sendAsync = function (l) {
        var u = this;
        return new Promise(function (o) {
          try {
            g(function () {
              return ["%c>>>> http send: " + p(l), "color:#00af00;font-weight:bold;"];
            })();
            var e = u._url || d.url,
              r = new te();
            for (t in ((r.responseType = f.HttpResponseType.ARRAY_BUFFER), u.defaultHeaders))
              u.defaultHeaders[t] && r.setRequestHeader(t, u.defaultHeaders[t]);
            if (l.headers)
              for (var t in l.headers) l.headers[t] && r.setRequestHeader(t, l.headers[t]);
            var n = ++u.seq,
              i = e + "/" + l.cmd.replace("_", "/").toLowerCase() + "?_seq=" + n,
              a =
                (l.hint && (i += "&_hint=" + l.hint),
                u.lang && (i += "&_lang=" + u.lang),
                w(l.params, u.enc)),
              s = (r.open(i, f.HttpMethod.POST), l.timeout || d.rpc.httpTimeout),
              c = (s && (r.timeout = s), Date.now());
            r.send(a)
              .then(function () {
                var t,
                  n = Date.now() - c,
                  e = b(r.response, u.enc);
                ((e =
                  "_resppak" == e.cmd
                    ? e.rawData.map(function (e) {
                        return new R(e);
                      })
                    : [e]).forEach(function (e) {
                  ((e.rtt = n),
                    e.resp && (t = e).setSendMsg(l),
                    g(function () {
                      return [
                        "%c<<<< http recieve: " + e.toLogString(),
                        "color:#00afaf;font-weight:bold;",
                      ];
                    })(),
                    u.doReceiveMsg(e));
                }),
                  t || (t = e[0]).setSendMsg(l),
                  o(t));
              })
              .catch(function (e) {
                o(u.onSendError(e));
              });
          } catch (e) {
            o(u.onSendError(e));
          }
        });
      }));
    var Ue,
      L = je,
      He =
        ((D = Fe.prototype),
        Object.defineProperty(D, "readyState", {
          get: function () {
            return this.raw.readyState;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(D, "binaryType", {
          get: function () {
            return this.raw.binaryType;
          },
          set: function (e) {
            this.raw.binaryType = e;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(D, "onopen", {
          get: function () {
            return this.raw.onopen;
          },
          set: function (e) {
            this.raw.onopen = e;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(D, "onclose", {
          get: function () {
            return this.raw.onclose;
          },
          set: function (e) {
            this.raw.onclose = e;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(D, "onerror", {
          get: function () {
            return this.raw.onerror;
          },
          set: function (e) {
            this.raw.onerror = e;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (D.getU32 = function (e) {
          return e[0] | (e[1] << 8) | (e[2] << 16) | (e[3] << 24);
        }),
        (D.onMsg = function (e) {
          var t,
            n = new Uint8Array(e.data);
          this.frameSize <= 0 ||
          (this.offset < 0 &&
            8 <= n.length &&
            1836213824 === this.getU32(n) &&
            ((t = this.getU32(n.subarray(4))),
            (this.buffer = new Uint8Array(t)),
            (n = n.subarray(8)),
            (this.offset = 0)),
          this.offset < 0)
            ? this.onmessage && this.onmessage(e)
            : (this.buffer.set(n, this.offset),
              (this.offset += n.length),
              (t = this.buffer.length),
              this.offset < this.buffer.length
                ? this.onframe &&
                  this.onframe({
                    total: t,
                    loaded: this.offset,
                  })
                : this.offset != this.buffer.length
                  ? ((this.buffer = void 0),
                    (this.offset = -1),
                    this.onerror && this.onerror(new Event("merge msg error")))
                  : ((n = this.buffer),
                    (this.buffer = void 0),
                    (this.offset = -1),
                    this.onmessage &&
                      this.onmessage({
                        data: n.buffer,
                      })));
        }),
        (D.send = function (e) {
          var t = e.byteLength;
          if (this.frameSize <= 0 || t <= this.frameSize) this.raw.send(e);
          else {
            (this.header.setUint32(4, t, !0), this.raw.send(this.header.buffer));
            for (var n = 0; n < t; ) {
              var o = Math.min(t, n + this.frameSize);
              (this.raw.send(e.slice(n, o)), (n = o));
            }
          }
        }),
        (D.close = function () {
          this.raw.close();
        }),
        Fe),
      ke =
        globalThis.requestAnimationFrame ||
        function (e) {
          return setTimeout(e, 10);
        };

    function Fe(e, t) {
      var n = this;
      ((this.raw = e),
        (this.frameSize = +t),
        (this.offset = -1),
        0 < this.frameSize &&
          ((this.header = new DataView(new ArrayBuffer(8))),
          this.header.setUint32(0, 1836213824, !0)),
        (e.onmessage = function (e) {
          return n.onMsg(e);
        }));
    }

    function je(e) {
      var t = Ue.call(this) || this;
      return (
        (t.seq = 0),
        (t.defaultHeaders = {
          "Content-Type": "application/octet-stream",
          "content-type": "application/octet-stream",
        }),
        (t.encoding = f.Encoding.LX),
        e || (je.current = t),
        t
      );
    }
    ((f.WebSocketClientState = void 0),
      ((D = f.WebSocketClientState || (f.WebSocketClientState = {}))[(D.Idle = 0)] = "Idle"),
      (D[(D.Connecting = 1)] = "Connecting"),
      (D[(D.Running = 2)] = "Running"),
      (D[(D.Reconnecting = 3)] = "Reconnecting"),
      (D[(D.Error = 4)] = "Error"));
    ((D = Qe.prototype),
      Object.defineProperty(D, "length", {
        get: function () {
          return this._arr.length - this._idx;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (D.enqueue = function (e) {
        this._arr.push(e);
      }),
      (D.dequeue = function () {
        if (!(this._idx >= this._arr.length)) return this._arr[this._idx++];
      }),
      (D.confirm = function (e) {
        e = this._arr.length - this.seq + e - 1;
        (e = e >= this._idx ? this._idx - 1 : e) < 0 ||
          (this._arr.splice(0, e + 1), (this._idx -= e + 1));
      }),
      (D.restore = function () {
        this._idx = 0;
      }));
    var Ke = Qe,
      Ve =
        ((D = qe.prototype),
        Object.defineProperty(D, "seq", {
          get: function () {
            return this._seq;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(D, "length", {
          get: function () {
            return this._arr.length;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (D.enqueue = function (e) {
          if (0 < ~~e.seq) {
            if (e.seq <= this._seq) return;
            if (e.seq > this._seq + 1) throw new Error("over seq: " + e);
            this._seq = e.seq;
          }
          this._arr.push(e);
        }),
        (D.dequeue = function () {
          if (0 !== this._arr.length) return this._arr.shift();
        }),
        qe),
      We =
        (((D = Ye.prototype).update = function () {
          var e = Date.now();
          ((this._now += Math.max(8, Math.min(e - this._last, 100))), (this._last = e));
        }),
        Object.defineProperty(D, "now", {
          get: function () {
            return this._now;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Ye);

    function Ye() {
      this._last = this._now = Date.now();
    }

    function qe() {
      ((this._arr = []), (this._seq = 0));
    }

    function Qe() {
      ((this._arr = []), (this._idx = 0), (this.seq = 0));
    }

    function Xe(e, t) {
      try {
        e.resolve(t);
      } catch (e) {
        console.error(e);
      }
    }
    var ze,
      Je,
      Ze = new ArrayBuffer(1),
      M = {},
      $e = {},
      et = {
        sid: "sid",
        sid2: "sid2",
        lang: "lang",
        frameSize: "fs",
      },
      tt =
        ((D = ot.prototype),
        Object.defineProperty(D, "isDirect", {
          get: function () {
            return this.connectOptions && !!this.connectOptions.sid;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(D, "connected", {
          get: function () {
            return this._sm.curState == f.WebSocketClientState.Running;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(D, "connectionState", {
          get: function () {
            return this._sm.curState;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (D.resetSendData = function () {
          var e,
            t = this._sendData;
          for (e in t) t[e] = void 0;
          return t;
        }),
        (D.reset = function () {
          this._destroyed ||
            (this.cleanData(),
            this.events.emit("e_closed"),
            this._sm.changeState(f.WebSocketClientState.Idle));
        }),
        (D.destroy = function () {
          ((this._destroyed = !0),
            this.cleanData(),
            this.events.emit("e_closed"),
            this.events.clear());
        }),
        (D.getAndUseAck = function () {
          var e = this._ack;
          return ((this._ack = 0), e);
        }),
        (D.connect = function (e) {
          var t = this;
          if (this._sm.curState != f.WebSocketClientState.Idle) throw new Error("state error");
          ((this.enc = N(e.encoding)),
            (this.connectOptions = e),
            (this._url =
              e.url || d.url.replace("http://", "ws://").replace("https://", "wss://") + "/agent"),
            (this._connParam.roleToken = e.token),
            (this._connParam.version = e.version));
          e = new Promise(function (e) {
            t._connResolve = e;
          });
          return (this._sm.changeStateNextFrame(f.WebSocketClientState.Connecting), e);
        }),
        (D.onConnectingEnter = function () {
          (g(function () {
            return ["~~~~~~~~~onConnectingEnter"];
          })(),
            this.cleanWS(),
            (this._tryConnectTimeoutTotal = this._frameTimer.now + d.rpc.connectTimeoutTotal),
            (this._tryConnectTimeoutOnce = -1),
            (this._ws = void 0),
            (this._connParam.isRestore = 0),
            (this._nextTryConnectTime = 1),
            (this._tryConnectTimes = 0));
        }),
        (D.onConnectingUpdate = function () {
          this.tryConnect();
        }),
        (D.tryConnect = function () {
          var t = this,
            e = this._frameTimer.now;
          if (0 < this._tryConnectTimeoutTotal && e > this._tryConnectTimeoutTotal)
            ((this._tryConnectTimeoutTotal = -1),
              (this.closeReason = {
                code: f.ErrorCode.TIMEOUT,
                error: "connect timeout",
              }),
              this._sm.changeState(f.WebSocketClientState.Error));
          else if (
            0 !== this.networkState() &&
            (0 < this._tryConnectTimeoutOnce &&
              e > this._tryConnectTimeoutOnce &&
              ((this._tryConnectTimeoutOnce = -1),
              this.cleanWS(),
              (this._nextTryConnectTime = e + 100),
              (this._ws = void 0)),
            0 < this._nextTryConnectTime) &&
            e > this._nextTryConnectTime
          ) {
            (this._tryConnectTimes++,
              (this._nextTryConnectTime = -1),
              (this._tryConnectTimeoutOnce = e + d.rpc.connectTimeoutOnce),
              this.cleanWS(),
              (this._connParam.connId = Date.now()));
            var n,
              o = JSON.stringify(this._connParam),
              r = this.connectOptions,
              i = this._url + "?p=" + encodeURIComponent(o) + "&e=" + r.encoding;
            for (n in (this._connParam.isRestore && (i += "&ack=" + this._recQueue.seq), et)) {
              var a = r[n];
              a && (i += "&" + et[n] + "=" + encodeURIComponent(a));
            }
            1 < this._tryConnectTimes && (i += "&perMessageDeflate=0");
            o =
              (void 0 !== r.useKcp ? r : d.rpc).useKcp &&
              this._tryConnectTimes < 2 &&
              globalThis.KcpConnection;
            ((M.use = o ? "kcp" : "ws"), (M.url = i), (M.times = this._tryConnectTimes));
            try {
              (this.events.emit(c, M), (i = M.url));
            } catch (t) {
              console.error(t);
            }
            var s = ("kcp" === M.use && new globalThis.KcpConnection(i)) || new WebSocket(i);
            ((s.binaryType = "arraybuffer"),
              (this.use = M.use),
              ae("log", function () {
                return ["use " + M.use];
              })(),
              0 < +this.connectOptions.frameSize &&
                ((s = new He(s, this.connectOptions.frameSize)).onframe = function () {
                  t._ws === s && t.resetConnectionTimeout();
                }),
              ((this._ws = s).onopen = function () {
                s !== t._ws ||
                  (t._sm.curState != f.WebSocketClientState.Connecting &&
                    t._sm.curState != f.WebSocketClientState.Reconnecting) ||
                  t._sm.changeState(f.WebSocketClientState.Running);
              }),
              (s.onclose = s.onerror =
                function () {
                  s === t._ws &&
                    (t._nextTryConnectTime = Math.max(
                      t._frameTimer.now + 100,
                      e + d.rpc.connectRetryMinInterval,
                    ));
                }),
              (s.onmessage = function (e) {
                s === t._ws && t.addResp(e.data);
              }));
          }
        }),
        (D.send = function (e) {
          var t,
            n,
            o,
            r = this;
          return this._destroyed || this._sm.curState == f.WebSocketClientState.Error
            ? null
            : (((t = this.resetSendData()).ack = this.getAndUseAck()),
              (t.body = i.encode(e.params)),
              (t.c = e.c),
              t.c || (t.cmd = e.cmd),
              (t.hint = e.hint),
              (t.seq = ++this._sndQueue.seq),
              (t.time = Date.now()),
              d.debug &&
                (delete (n = Object.assign({}, t)).body,
                (n.data = e.params),
                (n.cmd = e.cmd),
                g(function () {
                  return ["%c>>>> " + r.use + " send: " + p(n), "color:#00af00;font-weight:bold;"];
                })()),
              (o = w(t, this.enc)),
              (t.cmd = e.cmd),
              this._sndQueue.enqueue(o),
              this._sm.curState === f.WebSocketClientState.Running && this.onRunningUpdate(),
              t);
        }),
        (D.sendAsync = function (e) {
          var t,
            n = this.send(e);
          return n
            ? (((t = e).seq = n.seq),
              (t.time = n.time),
              (e = new Promise(function (e) {
                return (t.resolve = e);
              })),
              this._asyncList.push(t),
              e)
            : Promise.resolve({
                code: f.ErrorCode.CANCELED,
                error: "offline",
              });
        }),
        (D.update = function () {
          var e = this;
          this._destroyed ||
            (this._frameTimer.update(),
            this._sm.update(),
            ke(function () {
              return e.update();
            }));
        }),
        (D.resetHeartbeatTime = function () {
          var e = Date.now();
          this._nextHeartbeatTime = e + d.rpc.heartbeatInterval;
        }),
        (D.resetConnectionTimeout = function () {
          var e = this._frameTimer.now;
          this._connectionTimeout = e + d.rpc.heartbeatTimeout;
        }),
        (D.onRunningEnter = function () {
          var t = this;
          (g(function () {
            return ["~~~~~~~~~onRunningEnter"];
          })(),
            (this.lastNetworkState = this.networkState()),
            ($e.use = M.use),
            ($e.url = M.url));
          try {
            this.events.emit(u, $e);
          } catch (t) {
            console.error(t);
          }
          (this._connResolve && (this._connResolve(!0), (this._connResolve = void 0)),
            this._sndQueue.restore(),
            this.resetHeartbeatTime(),
            this.resetConnectionTimeout());
          var n = this._ws;
          ((n.onmessage = function (e) {
            n === t._ws && t.addResp(e.data);
          }),
            (n.onerror = n.onclose =
              function () {
                n === t._ws && t.changeStateOnError();
              }));
        }),
        (D.addResp = function (e) {
          this.resetConnectionTimeout();
          try {
            if (!(e.byteLength <= 1)) {
              var t = b(e, this.enc);
              switch (
                (0 < ~~t.ack && this._sndQueue.confirm(~~t.ack),
                ~~t.seq > this._recQueue.seq && (this._ack = t.seq),
                t.cmd)
              ) {
                case "_sys/error":
                  if (t.error) console.error(t.error);
                  else
                    try {
                      console.error(i.decode(t.body));
                    } catch (e) {}
                  return void this.changeStateOnError();
                case "_sys/fatal":
                  if (t.error) console.error(t.error);
                  else
                    try {
                      console.error(i.decode(t.body));
                    } catch (e) {}
                  return (
                    (this.closeReason = t),
                    void this._sm.changeState(f.WebSocketClientState.Error)
                  );
                default:
                  return (
                    this._recQueue.enqueue(t),
                    void (
                      this._sm.curState === f.WebSocketClientState.Running && this.onRunningUpdate()
                    )
                  );
              }
            }
          } catch (e) {
            (console.error(e), this.changeStateOnError());
          }
        }),
        (D.onRunningUpdate = function () {
          var e = Date.now(),
            t = this._sm;
          if (this._frameTimer.now > this._connectionTimeout) this.changeStateOnError();
          else {
            var n = this.networkState();
            if (n != this.lastNetworkState && 0 < (this.lastNetworkState = n))
              this._sm.changeState(f.WebSocketClientState.Reconnecting);
            else {
              var o = d.rpc;
              if (0 < n) {
                e > this._nextHeartbeatTime && this.sendHeartbeat();
                for (
                  var r = o.maxSendOnce || 100;
                  0 < this._sndQueue.length && void 0 === t.nextState && 0 < r--;
                )
                  this.doSend(this._sndQueue.dequeue());
              }
              for (
                var i = o.maxRecvOnce || 100;
                0 < this._recQueue.length && void 0 === t.nextState && 0 < i--;
              ) {
                var a = this._recQueue.dequeue();
                this.doReceive(a);
              }
            }
          }
        }),
        (D.sendHeartbeat = function () {
          this.resetHeartbeatTime();
          var e,
            t = this.getAndUseAck();
          (g(function () {
            return ["~~~~~~~~~sendHeartbeat", t];
          })(),
            0 == t
              ? this.doSend(Ze)
              : (((e = this.resetSendData()).ack = t),
                (e.cmd = "_sys/ack"),
                (e.time = Date.now()),
                this.doSend(w(e, this.enc))));
        }),
        (D.doSend = function (e) {
          var t = this._ws;
          if (1 == t.readyState)
            try {
              t.send(e);
            } catch (e) {
              (this.changeStateOnError(), console.error(e));
            }
          else this.changeStateOnError();
        }),
        (D.doReceive = function (e) {
          var t = this,
            n = this._sm,
            o = Date.now();
          try {
            var r = this._asyncList,
              i = -1;
            if (0 < ~~e.resp)
              for (var a = 0, s = r.length; a < s; a++) {
                var c = r[a];
                if (e.resp === c.seq) {
                  ((e.rtt = o - c.time), e.setSendMsg(c), (i = a));
                  break;
                }
                if (e.resp < c.seq) break;
              }
            g(function () {
              return [
                "%c<<<< " + t.use + " recieve: " + e.toLogString(),
                "color:#00afaf;font-weight:bold;",
              ];
            })();
            try {
              this.events.emit(e.cmd, e);
            } catch (e) {
              console.error(e);
            }
            try {
              this.events.emit(l, e);
            } catch (e) {
              console.error(e);
            }
            if (0 <= i) {
              if (0 < i)
                for (a = 0; a < i; a++)
                  ((c = r[a]),
                    console.warn(c.cmd + " has no response, use send instead"),
                    Xe(c, {
                      code: f.ErrorCode.SKIP,
                      error: "skip",
                    }));
              (Xe(r[i], e), r.splice(0, i + 1));
            }
            e.code < 0 &&
              ((this.closeReason = e), n.changeStateNextFrame(f.WebSocketClientState.Error));
          } catch (e) {
            (console.error(e),
              (this.closeReason = {
                code: f.ErrorCode.UNKNOWN,
                error: e || "unkown",
              }),
              n.changeStateNextFrame(f.WebSocketClientState.Error));
          }
        }),
        (D.onReconnectingEnter = function () {
          (g(function () {
            return ["~~~~~~~~~onReconnectingEnter"];
          })(),
            this.cleanWS(),
            (this._tryConnectTimeoutTotal = this._frameTimer.now + d.rpc.connectTimeoutTotal),
            (this._tryConnectTimeoutOnce = -1),
            (this._connParam.isRestore = 1),
            (this._nextTryConnectTime = 1),
            (this._tryConnectTimes = 0));
        }),
        (D.onReconnectingUpdate = function () {
          this.tryConnect();
        }),
        (D.changeStateOnError = function () {
          this._sm.changeStateNextFrame(
            this.isDirect ? f.WebSocketClientState.Error : f.WebSocketClientState.Reconnecting,
          );
        }),
        (D.cleanWS = function () {
          this._ws &&
            ((this._ws.onerror =
              this._ws.onclose =
              this._ws.onmessage =
              this._ws.onopen =
              this._ws.onframe =
                void 0),
            this._ws.close(),
            (this._ws = void 0));
        }),
        (D.cleanData = function () {
          (this.cleanWS(),
            this._connResolve && (this._connResolve(!1), (this._connResolve = void 0)),
            (this._sndQueue = new Ke()),
            this._asyncList &&
              this._asyncList.forEach(function (e) {
                e.resolve({
                  code: f.ErrorCode.CANCELED,
                  error: "canceled",
                });
              }),
            (this._asyncList = []),
            (this._recQueue = new Ve()),
            (this._connParam = {
              roleToken: "",
              sessId: 100 * Date.now() + ~~(100 * Math.random()),
              connId: 0,
              isRestore: 0,
            }),
            (this._ack = 0));
        }),
        (D.onErrorEnter = function () {
          (g(function () {
            return ["~~~~~~~~~onErrorEnter"];
          })(),
            this.cleanData(),
            this.events.emit("e_closed", this.closeReason),
            (this.closeReason = void 0));
        }),
        (D.interrupt = function () {
          this._sm.curState === f.WebSocketClientState.Running &&
            this._sm.changeState(f.WebSocketClientState.Reconnecting);
        }),
        ot),
      P =
        (re(nt, (Je = t)),
        ((D = nt.prototype).connect = function (e) {
          var t = this;
          return (
            this.close(),
            (this.socket = new tt()),
            this.socket.events.on(l, this.onReceiveMsg, this),
            this.socket.events.once("e_closed", function (e) {
              t.events.emit("e_closed", e.data);
            }),
            this.socket.events.on(c, function (e) {
              t.events.emit(c, e.data);
            }),
            this.socket.events.on(u, function (e) {
              t.events.emit(u, e.data);
            }),
            this.socket.connect(e)
          );
        }),
        Object.defineProperty(D, "connected", {
          get: function () {
            return this.socket && this.socket.connected;
          },
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(D, "connectionState", {
          get: function () {
            return this.socket ? this.socket.connectionState : f.WebSocketClientState.Idle;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (D.close = function () {
          this.socket && this.socket.destroy();
        }),
        (D.send = function (e) {
          this.socket.send(e);
        }),
        (D.sendAsync = function (e) {
          return this.socket.sendAsync(e);
        }),
        (D.onReceiveMsg = function (e) {
          this.doReceiveMsg(e.data);
        }),
        (D.interrupt = function () {
          var e;
          null != (e = this.socket) && e.interrupt();
        }),
        nt),
      D =
        (re(B, (ze = t)),
        ((D = B.prototype).autoRecover = function () {
          var t = this;
          this.socket &&
            (this.socket.reset(),
            this.socket.events.once("e_closed", function (e) {
              (t.events.emit("e_closed", e.data),
                Promise.resolve().then(function () {
                  t.autoRecover();
                }));
            }),
            this.socket.connect(this.options));
        }),
        Object.defineProperty(D, "connected", {
          get: function () {
            return this.socket && this.socket.connected;
          },
          enumerable: !1,
          configurable: !0,
        }),
        (D.close = function () {
          this.socket && this.socket.destroy();
        }),
        (D.send = function (e) {
          this.socket.send(e);
        }),
        (D.sendAsync = function (e) {
          return this.socket.sendAsync(e);
        }),
        (D.onReceiveMsg = function (e) {
          this.doReceiveMsg(e.data);
        }),
        B);

    function B(e) {
      var t = ze.call(this) || this;
      return (
        B.ins && B.ins.close(),
        (B.ins = t),
        ((P.current = t).options = e),
        (t.socket = new tt()),
        t.socket.events.on(l, t.onReceiveMsg, t),
        t.socket.events.on(c, function (e) {
          t.events.emit(c, e.data);
        }),
        t.socket.events.on(u, function (e) {
          t.events.emit(u, e.data);
        }),
        t.autoRecover(),
        t
      );
    }

    function nt(e) {
      var t = Je.call(this) || this;
      return (e || (nt.current = t), t);
    }

    function ot() {
      var e = this;
      ((this._destroyed = !1),
        (this._sendData = {}),
        (this.events = new s()),
        (this.enc = N("")),
        ((globalThis.ws = this).networkState = d.rpc.networkState),
        (this._sm = new q()),
        this._sm.registerState({
          state: f.WebSocketClientState.Running,
          enter: function () {
            return e.onRunningEnter();
          },
          update: function () {
            return e.onRunningUpdate();
          },
        }),
        this._sm.registerState({
          state: f.WebSocketClientState.Connecting,
          enter: function () {
            return e.onConnectingEnter();
          },
          update: function () {
            return e.onConnectingUpdate();
          },
        }),
        this._sm.registerState({
          state: f.WebSocketClientState.Reconnecting,
          enter: function () {
            return e.onReconnectingEnter();
          },
          update: function () {
            return e.onReconnectingUpdate();
          },
        }),
        this._sm.registerState({
          state: f.WebSocketClientState.Error,
          enter: function () {
            return e.onErrorEnter();
          },
        }),
        this._sm.changeState(f.WebSocketClientState.Idle),
        (this._frameTimer = new We()),
        this.reset(),
        ke(function () {
          return e.update();
        }));
    }
    (P.current || new P(), L.current || new L());
    var rt = {
        send: function (e) {
          return P.current.send(e);
        },
        sendAsync: function (e) {
          return P.current.sendAsync(e);
        },
        sendHttpAsync: function (e) {
          return L.current.sendAsync(e);
        },
      },
      it = rt;

    function at(e) {
      it = e;
    }

    function st(e) {
      return e.useHttp ? it.sendHttpAsync(e) : e.respType ? it.sendAsync(e) : it.send(e);
    }
    var ct = Object.freeze({
      __proto__: null,
      version: "3.1.48",
      options: d,
      addStartBack: U,
      startup: H,
      bkdrHash: o,
      bkdrHashStr: F,
      bkdrHashStrFast: j,
      lz4Encode: W,
      lz4Decode: Y,
      lz4XorEncode: K,
      lz4XorDecode: V,
      StateMachine: q,
      sleep: X,
      TimeUtil: ee,
      xorEncode: z,
      xorDecode: J,
      toJsonStringSB: p,
      get HttpMethod() {
        return f.HttpMethod;
      },
      get HttpResponseType() {
        return f.HttpResponseType;
      },
      HttpRequest: te,
      HttpDelegate: L,
      get WebSocketClientState() {
        return f.WebSocketClientState;
      },
      WebSocketClient: tt,
      WebSocketDelegate: P,
      WebSocketDelegateAutoRecover: D,
      DelegateBase: t,
      get Encoding() {
        return f.Encoding;
      },
      encMsg: w,
      decMsg: b,
      registerEncryptor: Ge,
      getEncryptor: N,
      get ErrorCode() {
        return f.ErrorCode;
      },
      ReceiveMsgImpl: R,
      defaultSender: rt,
      setSender: at,
      sendAuto: st,
      SyncData: e,
      syncData: se,
      EVENT_MSG: l,
      EVENT_CLOSED: "e_closed",
      EVENT_PRECONNECT: c,
      EVENT_CONNECTED: u,
      EventEmitter: s,
      DataBase: S,
      toPlain: A,
      reset: T,
      toTyped: I,
      record: Me,
      key: Pe,
      getTypeInfoByName: he,
      getTypeInfoByInstance: h,
      getTypeInfo: _,
      TypeInfo: ye,
      PropInfo: m,
      prop: E,
      type: Se,
      clazz: Te,
      autoProp: Re,
      any_t: y,
      array_t: Oe,
      map_t: C,
      get isArray() {
        return f.isArray;
      },
      setIsArray: we,
      get isMap() {
        return f.isMap;
      },
      setIsMap: be,
    });
    ((globalThis.o4e = Object.assign(globalThis.o4e || {}, ct)),
      (f.DataBase = S),
      (f.DelegateBase = t),
      (f.EVENT_CLOSED = "e_closed"),
      (f.EVENT_CONNECTED = u),
      (f.EVENT_MSG = l),
      (f.EVENT_PRECONNECT = c),
      (f.EventEmitter = s),
      (f.HttpDelegate = L),
      (f.HttpRequest = te),
      (f.PropInfo = m),
      (f.ReceiveMsgImpl = R),
      (f.StateMachine = q),
      (f.SyncData = e),
      (f.TimeUtil = ee),
      (f.TypeInfo = ye),
      (f.WebSocketClient = tt),
      (f.WebSocketDelegate = P),
      (f.WebSocketDelegateAutoRecover = D),
      (f.addStartBack = U),
      (f.any_t = y),
      (f.array_t = Oe),
      (f.autoProp = Re),
      (f.bkdrHash = o),
      (f.bkdrHashStr = F),
      (f.bkdrHashStrFast = j),
      (f.clazz = Te),
      (f.decMsg = b),
      (f.defaultSender = rt),
      (f.encMsg = w),
      (f.getEncryptor = N),
      (f.getTypeInfo = _),
      (f.getTypeInfoByInstance = h),
      (f.getTypeInfoByName = he),
      (f.key = Pe),
      (f.lz4Decode = Y),
      (f.lz4Encode = W),
      (f.lz4XorDecode = V),
      (f.lz4XorEncode = K),
      (f.map_t = C),
      (f.options = d),
      (f.prop = E),
      (f.record = Me),
      (f.registerEncryptor = Ge),
      (f.reset = T),
      (f.sendAuto = st),
      (f.setIsArray = we),
      (f.setIsMap = be),
      (f.setSender = at),
      (f.sleep = X),
      (f.startup = H),
      (f.syncData = se),
      (f.toJsonStringSB = p),
      (f.toPlain = A),
      (f.toTyped = I),
      (f.type = Se),
      (f.version = "3.1.48"),
      (f.xorDecode = J),
      (f.xorEncode = z));
  });
  register("14", function () {
    !function (r) {
      var e = function () {
        "use strict";

        function e() {}

        function t(e) {
          this.label = e = void 0 === e ? "utf8" : e;
        }
        var i, n, o;
        ((n = "undefined"),
          (o =
            typeof globalThis != n
              ? globalThis
              : typeof window != n
                ? window
                : typeof r != n
                  ? r
                  : {}).globalThis || (o.globalThis = o),
          Uint8Array.prototype.slice ||
            Object.defineProperty(Uint8Array.prototype, "slice", {
              value: function (e, t) {
                return new Uint8Array(Array.prototype.slice.call(this, e, t));
              },
            }),
          Uint8Array.prototype.copyWithin ||
            Object.defineProperty(Uint8Array.prototype, "copyWithin", {
              value: function (e, t, n) {
                this.set(this.subarray(t, n || this.length), e);
              },
            }),
          o.__spreadArray ||
            (o.__spreadArray = function (e, t) {
              for (var n = 0, o = t.length, r = e.length; n < o; n++, r++) e[r] = t[n];
              return e;
            }),
          typeof TextEncoder == n &&
            ((e.prototype.encode = function (e) {
              var t;
              return 0 === e.length
                ? new Uint8Array(0)
                : ((t = new Uint8Array(6 * e.length)),
                  (e = this.encodeInto(e, t)),
                  t.subarray(0, e.written));
            }),
            (o.TextEncoder = e)),
          TextEncoder.prototype.encodeInto ||
            Object.defineProperty(TextEncoder.prototype, "encodeInto", {
              value: function (e, t) {
                for (var n = 0, o = 0; o < e.length; o++)
                  (r = e.codePointAt(o)) <= 127
                    ? (t[n++] = r)
                    : r <= 2047
                      ? ((t[n++] = (r >>> 6) | 192), (t[n++] = ((r >>> 0) & 63) | 128))
                      : r <= 65535
                        ? ((t[n++] = (r >>> 12) | 224),
                          (t[n++] = ((r >>> 6) & 63) | 128),
                          (t[n++] = ((r >>> 0) & 63) | 128))
                        : r <= 2097151
                          ? ((t[n++] = (r >>> 18) | 240),
                            (t[n++] = ((r >>> 12) & 63) | 128),
                            (t[n++] = ((r >>> 6) & 63) | 128),
                            (t[n++] = ((r >>> 0) & 63) | 128),
                            o++)
                          : r <= 67108863
                            ? ((t[n++] = (r >>> 24) | 248),
                              (t[n++] = ((r >>> 18) & 63) | 128),
                              (t[n++] = ((r >>> 12) & 63) | 128),
                              (t[n++] = ((r >>> 6) & 63) | 128),
                              (t[n++] = ((r >>> 0) & 63) | 128),
                              o++)
                            : r <= 2147483647 &&
                              ((t[n++] = (r >>> 30) | 252),
                              (t[n++] = ((r >>> 24) & 63) | 128),
                              (t[n++] = ((r >>> 18) & 63) | 128),
                              (t[n++] = ((r >>> 12) & 63) | 128),
                              (t[n++] = ((r >>> 6) & 63) | 128),
                              (t[n++] = ((r >>> 0) & 63) | 128),
                              o++);
                if (!(n <= t.length))
                  for (var r, n = 0, o = 0, i = t.length; o < e.length; o++)
                    if ((r = e.codePointAt(o)) <= 127) {
                      if (i < n + 1) break;
                    } else if (r <= 2047) {
                      if (i < n + 2) break;
                    } else if (r <= 65535) {
                      if (i < n + 3) break;
                    } else if (r <= 2097151) {
                      if (i < n + 4) break;
                      o++;
                    } else if (r <= 67108863) {
                      if (i < n + 5) break;
                      o++;
                    } else if (r <= 2147483647) {
                      if (i < n + 6) break;
                      o++;
                    }
                return {
                  read: o,
                  written: n,
                };
              },
            }),
          typeof TextDecoder == n &&
            ((i = []),
            (t.prototype.decode = function (e) {
              if (0 === e.length) return "";
              if ("utf8" !== this.label) throw new Error("unsupport encoding: " + this.label);
              var t = 0,
                n = e.length,
                o = "";
              for (i.length = 0; t < n; ) {
                3e4 <= i.length && ((o += String.fromCodePoint.apply(String, i)), (i.length = 0));
                var r = e[t++];
                if (0 != (128 & r))
                  if (192 != (224 & r))
                    if (224 != (240 & r))
                      if (240 != (248 & r))
                        if (248 != (252 & r)) {
                          if (252 != (254 & r))
                            throw new Error("unsupport utf8 code: " + r + " at " + t);
                          i.push(
                            ((1 & r) << 30) |
                              ((63 & e[t++]) << 24) |
                              ((63 & e[t++]) << 18) |
                              ((63 & e[t++]) << 12) |
                              ((63 & e[t++]) << 6) |
                              (63 & e[t++]),
                          );
                        } else
                          i.push(
                            ((3 & r) << 24) |
                              ((63 & e[t++]) << 18) |
                              ((63 & e[t++]) << 12) |
                              ((63 & e[t++]) << 6) |
                              (63 & e[t++]),
                          );
                      else
                        i.push(
                          ((7 & r) << 18) |
                            ((63 & e[t++]) << 12) |
                            ((63 & e[t++]) << 6) |
                            (63 & e[t++]),
                        );
                    else i.push(((15 & r) << 12) | ((63 & e[t++]) << 6) | (63 & e[t++]));
                  else i.push(((31 & r) << 6) | (63 & e[t++]));
                else i.push(r);
              }
              return ((o += String.fromCodePoint.apply(String, i)), (i.length = 0), o);
            }),
            (o.TextDecoder = t)),
          "object" != typeof env && (globalThis.env = Object.create(null)),
          (env.ENV = "dev"));
      };
      "function" == typeof define && define.amd ? define(e) : e();
    }.call(
      this,
      "undefined" != typeof global
        ? global
        : "undefined" != typeof self
          ? self
          : "undefined" != typeof window
            ? window
            : {},
    );
  });
  register("16", function (e, t, d) {
    var f = e("./xxh32.js"),
      _ = e("./util.js"),
      p = n(5 << 20),
      g = (function () {
        try {
          return new Uint32Array(65536);
        } catch (e) {
          for (var t = new Array(65536), n = 0; n < 65536; n++) t[n] = 0;
          return t;
        }
      })(),
      h = {
        4: 65536,
        5: 262144,
        6: 1048576,
        7: 4194304,
      };

    function n(t) {
      try {
        return new Uint8Array(t);
      } catch (e) {
        for (var n = new Array(t), o = 0; o < t; o++) n[o] = 0;
        return n;
      }
    }

    function o(e, t, n) {
      if ((e.buffer, Uint8Array.prototype.slice)) return e.slice(t, n);
      var o = e.length;
      ((t = (t |= 0) < 0 ? Math.max(o + t, 0) : Math.min(t, o)),
        (n = (n = void 0 === n ? o : 0 | n) < 0 ? Math.max(o + n, 0) : Math.min(n, o)));
      for (var r = new Uint8Array(n - t), i = t, a = 0; i < n; ) r[a++] = e[i++];
      return r;
    }
    ((d.compressBound = function (e) {
      return (e + e / 255 + 16) | 0;
    }),
      (d.decompressBound = function (e) {
        var t = 0;
        if (407708164 !== _.readU32(e, t)) throw new Error("invalid magic number");
        t += 4;
        var n = e[t++];
        if (64 != (192 & n)) throw new Error("incompatible descriptor version " + (192 & n));
        var o = 0 != (16 & n),
          n = 0 != (8 & n),
          r = (e[t++] >> 4) & 7;
        if (void 0 === h[r]) throw new Error("invalid block size " + r);
        var i = h[r];
        if (n) return _.readU64(e, t);
        t++;
        for (var a = 0; ; ) {
          var s = _.readU32(e, t);
          if (((t += 4), (a += 2147483648 & s ? (s &= 2147483647) : i), 0 === s)) return a;
          (o && (t += 4), (t += s));
        }
      }),
      (d.makeBuffer = n),
      (d.decompressBlock = function (e, t, n, o, r) {
        for (var i, a, s, c, l = n + o; n < l; ) {
          var u = e[n++],
            d = u >> 4;
          if (0 < d) {
            if (15 === d) for (; (d += e[n]), 255 === e[n++]; );
            for (s = n + d; n < s; ) t[r++] = e[n++];
          }
          if (l <= n) break;
          if (((a = e[n++] | (e[n++] << 8)), 15 === (i = 15 & u)))
            for (; (i += e[n]), 255 === e[n++]; );
          for (s = (c = r - a) + (i += 4); c < s; ) t[r++] = 0 | t[c++];
        }
        return r;
      }),
      (d.compressBlock = function (e, t, n, o, r) {
        var i,
          a,
          s = 0,
          c = o + n,
          l = n;
        if (13 <= o)
          for (var u = 67; n + 4 < c - 5; ) {
            var d = _.readU32(e, n),
              f = _.hashU32(d) >>> 0,
              p = r[(f = (((f >> 16) ^ f) >>> 0) & 65535)] - 1;
            if (((r[f] = n + 1), p < 0 || 0 < (n - p) >>> 16 || _.readU32(e, p) !== d))
              n += u++ >> 6;
            else {
              for (u = 67, i = n - l, f = n - p, p += 4, d = n += 4; n < c - 5 && e[n] === e[p]; )
                (n++, p++);
              var g = (d = n - d) < 15 ? d : 15;
              if (15 <= i) {
                for (t[s++] = 240 + g, a = i - 15; 255 <= a; a -= 255) t[s++] = 255;
                t[s++] = a;
              } else t[s++] = (i << 4) + g;
              for (var h = 0; h < i; h++) t[s++] = e[l + h];
              if (((t[s++] = f), (t[s++] = f >> 8), 15 <= d)) {
                for (a = d - 15; 255 <= a; a -= 255) t[s++] = 255;
                t[s++] = a;
              }
              l = n;
            }
          }
        if (0 === l) return 0;
        if (15 <= (i = c - l)) {
          for (t[s++] = 240, a = i - 15; 255 <= a; a -= 255) t[s++] = 255;
          t[s++] = a;
        } else t[s++] = i << 4;
        for (n = l; n < c; ) t[s++] = e[n++];
        return s;
      }),
      (d.decompressFrame = function (e, t) {
        var n = 0,
          o = 0;
        if (407708164 !== _.readU32(e, n)) throw new Error("invalid magic number");
        if (((n += 4), 64 != (192 & (a = e[n++]))))
          throw new Error("incompatible descriptor version");
        var r = 0 != (16 & a),
          i = 0 != (4 & a),
          a = 0 != (8 & a),
          s = (e[n++] >> 4) & 7;
        if (void 0 === h[s]) throw new Error("invalid block size");
        for (a && (n += 8), n++; ; ) {
          var c = _.readU32(e, n);
          if (((n += 4), 0 === c)) break;
          if ((r && (n += 4), 0 != (2147483648 & c))) {
            c &= 2147483647;
            for (var l = 0; l < c; l++) t[o++] = e[n++];
          } else ((o = d.decompressBlock(e, t, n, c, o)), (n += c));
        }
        return (i && (n += 4), o);
      }),
      (d.compressFrame = function (e, t) {
        for (
          var n = 0,
            o =
              (_.writeU32(t, n, 407708164),
              (n += 4),
              (t[n++] = 64),
              (t[n++] = 112),
              (t[n] = f.hash(0, t, 4, n - 4) >> 8),
              n++,
              h[7]),
            r = e.length,
            i = 0,
            a = 0;
          a < 65536;
          a++
        )
          g[a] = 0;
        for (; 0 < r; ) {
          var s,
            c = o < r ? o : r;
          if ((s = d.compressBlock(e, p, i, c, g)) > c || 0 === s) {
            (_.writeU32(t, n, 2147483648 | c), (n += 4));
            for (var l = i + c; i < l; ) t[n++] = e[i++];
          } else {
            (_.writeU32(t, n, s), (n += 4));
            for (var u = 0; u < s; ) t[n++] = p[u++];
            i += c;
          }
          r -= c;
        }
        return (_.writeU32(t, n, 0), n + 4);
      }),
      (d.decompress = function (e, t) {
        var n;
        return (
          void 0 === t && (t = d.decompressBound(e)),
          (n = d.makeBuffer(t)),
          (n = (e = d.decompressFrame(e, n)) !== t ? o(n, 0, e) : n)
        );
      }),
      (d.compress = function (e, t) {
        var n;
        return (
          void 0 === t && (t = d.compressBound(e.length)),
          (n = d.makeBuffer(t)),
          (n = (e = d.compressFrame(e, n)) !== t ? o(n, 0, e) : n)
        );
      }));
  });
  register("17", function (e, t, n) {
    ((n.hashU32 = function (e) {
      return (
        (-1252372727 ^
          (e =
            ((e =
              ((e =
                (374761393 +
                  (e = -949894596 ^ (e = (2127912214 + (e |= 0) + (e << 12)) | 0) ^ (e >>> 19)) +
                  (e << 5)) |
                0) -
                744332180) ^
              (e << 9)) -
              42973499 +
              (e << 3)) |
            0) ^
          (e >>> 16)) |
        0
      );
    }),
      (n.readU64 = function (e, t) {
        var n = 0;
        return (
          (n |= e[t++] << 0) |
          (e[t++] << 8) |
          (e[t++] << 16) |
          (e[t++] << 24) |
          (e[t++] << 32) |
          (e[t++] << 40) |
          (e[t++] << 48) |
          (e[t++] << 56)
        );
      }),
      (n.readU32 = function (e, t) {
        var n = 0;
        return (n |= e[t++] << 0) | (e[t++] << 8) | (e[t++] << 16) | (e[t++] << 24);
      }),
      (n.writeU32 = function (e, t, n) {
        ((e[t++] = (n >> 0) & 255),
          (e[t++] = (n >> 8) & 255),
          (e[t++] = (n >> 16) & 255),
          (e[t++] = (n >> 24) & 255));
      }),
      (n.imul = function (e, t) {
        var n = 65535 & e,
          o = 65535 & t;
        return (n * o + (((e >>> 16) * o + n * (t >>> 16)) << 16)) | 0;
      }));
  });
  register("18", function (e, t, n) {
    var d = e("./util.js"),
      f = 2654435761,
      p = 2246822519;

    function g(e, t) {
      return ((e |= 0) >>> ((32 - (t |= 0)) | 0)) | (e << t) | 0;
    }

    function h(e, t, n) {
      return 0 | d.imul(((e |= 0) >>> ((32 - (t |= 0)) | 0)) | (e << t), (n |= 0));
    }

    function _(e, t) {
      return (((e |= 0) >>> (t |= 0)) ^ e) | 0;
    }

    function m(e, t, n, o, r) {
      return h(d.imul(t, n) + e, o, r);
    }
    n.hash = function (e, t, n, o) {
      var r,
        i,
        a,
        s,
        c,
        l,
        u = o;
      if (16 <= o) {
        for (r = [e + f + p, e + p, e, e - f]; 16 <= o; )
          ((a = t),
            (s = n),
            (r = [
              m((i = r)[0], d.readU32(a, s + 0), p, 13, f),
              m(i[1], d.readU32(a, s + 4), p, 13, f),
              m(i[2], d.readU32(a, s + 8), p, 13, f),
              m(i[3], d.readU32(a, s + 12), p, 13, f),
            ]),
            (n += 16),
            (o -= 16));
        r = g(r[0], 1) + g(r[1], 7) + g(r[2], 12) + g(r[3], 18) + u;
      } else r = (e + 374761393 + o) >>> 0;
      for (; 4 <= o; )
        ((c = n), (r = m(r, d.readU32(t, c), 3266489917, 17, 668265263)), (n += 4), (o -= 4));
      for (; 0 < o; ) ((l = n), (r = h(r + d.imul(t[l], 374761393), 11, f)), n++, o--);
      return _(d.imul(_(d.imul(_(r, 15), p), 13), 3266489917), 16) >>> 0;
    };
  });

  
  load("14");
  var o4e = load("13");

  
  window.GameCrypto = {
    
    encMsg: o4e.encMsg,
    decMsg: o4e.decMsg,
    
    lz4XorEncode: o4e.lz4XorEncode,
    lz4XorDecode: o4e.lz4XorDecode,
    
    xorEncode: o4e.xorEncode,
    xorDecode: o4e.xorDecode,
    
    lz4Encode: o4e.lz4Encode,
    lz4Decode: o4e.lz4Decode,
    
    getEncryptor: o4e.getEncryptor,
    registerEncryptor: o4e.registerEncryptor,
    
    ReceiveMsgImpl: o4e.ReceiveMsgImpl,
    
    bon: typeof globalThis !== "undefined" ? globalThis.bon : null,
    version: o4e.version,
  };
})();
