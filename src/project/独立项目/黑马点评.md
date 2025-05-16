# 黑马点评
+ **string（字符串）: **基本的数据存储单元，可以存储字符串、整数或者浮点数。
+ **hash（哈希）:**一个键值对集合，可以存储多个字段。
+ **list（列表）:**一个简单的列表，可以存储一系列的字符串元素。
+ **set（集合）:**一个无序集合，可以存储不重复的字符串元素。
+ **zset(sorted set：有序集合): **类似于集合，但是每个元素都有一个分数（score）与之关联。
1. ①字符串（String）
+ `SET key value`：设置键的值。
+ `GET key`：获取键的值。
+ `MSET:`批量添加多个String类型的键值对
+ `MGET`:根据key批量过去多个String类型的value

②哈希(hash)

+ `HSET key field value`：设置哈希表中字段的值。
+ `HGET key field`：获取哈希表中字段的值。
+ `HDEL key filed`：删除存储在哈希表中的指定字段
+ `HKEYS key`：获取哈希表中所有字段
+ `HVALS key`：获取哈希表中所有值
+ `HMSET`：批量添加多个hash类型的filed的值
+ `HMGET`:批量获取多个hash类型key的filed值

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1744534210533-f431f836-a19a-4df8-8c43-228fc656e9fb.png)

③列表(list)

+ `LPUSH key value[value2]`：将值插入到列表头部。
+ `LRANGE key start stop`：获取指定范围内的元素
+ `LLEN key`：获取列表的长度 `**start**`：起始索引（从 0 开始）`**stop**`：结束索引（支持负数，表示倒数第几个元素）
+ `LPOP key`：移出并获取列表的第一个元素。
+ `RPOP key`：移出并获取列表的最后一个元素。

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1744534183331-d74f1df9-e498-4c19-9624-2776b988c3b9.png)

④集合(set)：无序无重复

+ SADD key member1 [member2] 向集合添加一个或多个成员  
SMEMBERS key 返回集合中的所有成员  
SCARD key 获取集合的成员数  
SINTER key1 [key2] 返回给定所有集合的交集  
SUNION key1 [key2] 返回所有给定集合的并集  
SREM key member1 [member2] 删除集合中一个或多个成员

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1744534762949-fd358829-5308-480a-81fd-9d3ac8fc3b6f.png)

⑤有序集合(zset)：每个元素回关联一个double类型的分数，进行排序

+ `ZADD key score member1 [score2 member2]`：向有序集合添加一个或多个成员，或更新已存在成员的分数。
+ `ZRANGE key start stop [WITHSCORES]`：返回指定范围内的成员。（默认顺序从小到大）
+ `ZINCRBY key increment member`：有序集合中对指定成员的分数加上增量increment
+ `ZREM key member [member ...]`：移除有序集合中的一个或多个成员。
2. 通用命令
+ `KYES pattern`:查找所有符合给定模式的key
+ `EXIST`:检查给定key是否存在
+ `EXPURE`:给key设置一个有效期
+ `DEL key`:该命令用于在key存在时删除key
+ `TTL`:查看一个key的剩余有效期

## Jedis
1. 使用方法：①引入相关maven坐标

  ②建立连接池

```java
	//0.创建一个配置对象来配置连接池
	JedisPoolConfie config = new JedisPoolConfie();
	config.setMaxTotal(50);//最大连接对象
	config.setMaxIdle(10);//最大闲置对象
	
	//1.创建Jedis连接池对象
	JedisPool jedisPool = new JedisPool(config, "localhost", 6379);
	
	//2.获取连接
	Jedis jedis = jedisPool.getResource();

	//3.使用
	jedis.set("language","java");
	
	//4.关闭归还到连接池中
	jedis.close();


```

## SpringDataRedis
1. 使用方法

①引入spring-boot-starter-data-redis依赖

②再application.yml配置Redis信息

③注入RedsiTemplate

| 操作 | 说明 | 示例方法 |
| :--- | :--- | :--- |
| String | 普通的 key-value | `opsForValue()` |
| Hash | 类似 Map | `opsForHash()` |
| List | 列表 | `opsForList()` |
| Set | 集合 | `opsForSet()` |
| ZSet | 有序集合 | `opsForZSet()` |


2. 序列化：将Java对象转为字节流

①自定义RedisTemplate，修改RedisTemplate序列化器为GenericJackson2JsonRedisSerializer

```java
@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        //创建RedisTemplate对象
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        //设置连接工厂
        template.setConnectionFactory(factory);
        //创建序列化工具
        GenericJackson2JsonRedisSerializer jsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(jsonRedisSerializer);
        template.setHashValueSerializer(jsonRedisSerializer);
        return template;
    }
}
```

②使用StringRedisTemplate，写入Redis时，手动把对象序列化JSON，读取Redis时，手动把读取到的JSON反序列化为对象

```java
@Autowired
    StringRedisTemplate stringRedisTemplate;
    //Json工具
    private static final ObjectMapper mapper = new ObjectMapper();
    @Test
    void contextLoads() throws JsonProcessingException {
        //准备对象
        User user = new User("虎哥",18);
        //手动序列化
        String json = mapper.writeValueAsString(user);
        //写入一条数据
        stringRedisTemplate.opsForValue().set("user", json);
        //读取数据
        String val = stringRedisTemplate.opsForValue().get("user");
        //反序列化
        User user2 = mapper.readValue(val, User.class);
        System.out.println(user2);
    }
```

## 使用Mybatis-Puls进行登录
1. 发送验证码

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1745920328778-f3459dde-8930-4eed-a299-1048c67613b5.png)

```java
/**
     * 发送验证码
     * @param phone
     * @param session
     * @return
     */
    @Override
    public Result sendCode(String phone, HttpSession session) {
        //校验手机号
        if(RegexUtils.isPhoneInvalid(phone)){
            return Result.fail("手机号码格式错误！");
        }
        //生成验证码
        String code = RandomUtil.randomNumbers(6);
        //保存验证码到session
        session.setAttribute("code",code);
        //发送验证码
        log.info("发送验证码成功:{}",code);
        return Result.ok();
    }
```

2. 验证码登录和注册功能

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1745914129802-b1d1390a-ad24-4cc3-bcfa-932179b99999.png)

```java
@Override
    public Result login(LoginFormDTO loginForm, HttpSession session) {
        String phone = loginForm.getPhone();
        //校验手机号
        if(RegexUtils.isPhoneInvalid(phone)){
            return Result.fail("手机号码格式错误！");
        }
        //校验验证码
        Object cacheCode = session.getAttribute("code");
        String code = loginForm.getCode();
        if(cacheCode==null || !cacheCode.toString().equals(code)){
            //不一致报错
            return Result.fail("验证码错误");
        }
        //一致，根据手机号查询用户
        User user= query().eq("phone", phone).one();
        //判断用户是否存在
        if (user==null) {
            //不存在，创建新用户并保存
            user = createUserWithPhone(phone);
        }

        //存在保存
        session.setAttribute("user", BeanUtil.copyProperties(user, UserDTO.class));
        return Result.ok();
    }

    private User createUserWithPhone(String phone) {
        User user = new User();
        user.setPhone(phone);
        user.setNickName(SystemConstants.USER_NICK_NAME_PREFIX + RandomUtil.randomNumbers(6));
        //将user保存到表中
        save(user);
        return user;
    }
```

3. 实现登录校验拦截器

①创建拦截器②配置拦截器

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1745914325002-dcc555d1-99db-4ac2-9be5-604678bb3b50.png)

```java
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //获取session
        HttpSession session = request.getSession();
        //获取session中的用户
        Object user = session.getAttribute("user");
        //判单用户是否存在
        if(user == null) {
            //不存在，拦截
            response.setStatus(401);
            return false;
        }
        //存在，保存用户信息到ThreadLocal
        UserHolder.saveUser((UserDTO)user);
        //放行
        return true;

    }
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        UserHolder.removeUser();
    }
}
```

```java
public class MvcConfig implements WebMvcConfigurer {
    @Override//以下路径不需要登录验证
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginInterceptor())
                .excludePathPatterns("/user/login"
                                ,"/user/code"
                                ,"/shop/**",
                                "/shop/type/**"
                                ,"/upload/**"
                                ,"/blog/hot");
    }
}
```

4. Session共享问题：不同的TomCat的Session不能共享 解决办法：使用Redis进行存储

## 使用Redis实现登录
1. 发送验证码

```java
@Resource
    private StringRedisTemplate stringRedisTemplate;
    /**
     * 发送验证码
     * @param phone
     * @param session
     * @return
     */
    @Override
    public Result sendCode(String phone, HttpSession session) {
        //校验手机号
        if(RegexUtils.isPhoneInvalid(phone)){
            return Result.fail("手机号码格式错误！");
        }
        //生成验证码
        String code = RandomUtil.randomNumbers(6);
        //保存验证码到session
        stringRedisTemplate.opsForValue().set(LOGIN_CODE_KEY + phone,code,LOGIN_CODE_TTL, TimeUnit.MINUTES);
        //发送验证码
        log.info("发送验证码成功:{}",code);
        return Result.ok();
    }
```

2. 验证码登录

```java
/**
     * 登录
     * @param loginForm
     * @param session
     * @return
     */
    @Override
    public Result login(LoginFormDTO loginForm, HttpSession session) {
        String phone = loginForm.getPhone();
        //校验手机号
        if(RegexUtils.isPhoneInvalid(phone)){
            return Result.fail("手机号码格式错误！");
        }
        //从Redis获取验证码
        Object cacheCode = stringRedisTemplate.opsForValue().get(LOGIN_CODE_KEY + phone);
        String code = loginForm.getCode();
        if(cacheCode==null || !cacheCode.toString().equals(code)){
            //不一致报错
            return Result.fail("验证码错误");
        }
        //一致，根据手机号查询用户
        User user= query().eq("phone", phone).one();
        //判断用户是否存在
        if (user==null) {
            //不存在，创建新用户并保存
            user = createUserWithPhone(phone);
        }
        //保存用户信息到Redis中
            //随机生成token
        String token = UUID.randomUUID().toString(true);
        //将User对象转成hash存储
        UserDTO userDTO = BeanUtil.copyProperties(user, UserDTO.class);
        Map<String,Object> userMap = new HashMap<>();
        userMap.put("id",userDTO.getId().toString());
        userMap.put("nickName",userDTO.getNickName());
        userMap.put("icon",userDTO.getIcon());
        String tokenKey = LOGIN_USER_KEY + token;
        //存储到Redis中
        stringRedisTemplate.opsForHash().putAll(tokenKey, userMap);
        //设置有效期
        stringRedisTemplate.expire(LOGIN_USER_KEY + token, LOGIN_USER_TTL, TimeUnit.MINUTES);
        return Result.ok(token);
    }
```

3. 创建拦截器

```java
public class LoginInterceptor implements HandlerInterceptor {
    private StringRedisTemplate stringRedisTemplate;

    public LoginInterceptor(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1. 获取请求头中的 token
        String token = request.getHeader("authorization");
        if (StrUtil.isBlank(token)) {
            // token 不存在，拦截
            response.setStatus(401);
            return false;
        }


        // 2. 拼接 Redis 中的 key
        String key = LOGIN_USER_KEY + token;

        // 3. 检查 stringRedisTemplate 是否为 null
        if (stringRedisTemplate == null) {
            System.err.println("stringRedisTemplate is null in LoginInterceptor");
            response.setStatus(500); // Internal Server Error
            return false;
        }

        // 4. 查询 Redis 中的用户信息
        Map<Object, Object> userMap = stringRedisTemplate.opsForHash().entries(key);

        // 5. 判断是否存在用户信息
        if (userMap == null || userMap.isEmpty()) {
            // 不存在，拦截
            response.setStatus(401);
            return false;
        }

        // 6. 将查询的 Hash 数据转为 UserDTO 对象
        UserDTO userDTO = BeanUtil.fillBeanWithMap(userMap, new UserDTO(), false);

        // 7. 保存用户信息到 ThreadLocal
        UserHolder.saveUser(userDTO);

        // 8. 刷新 token 有效期
        stringRedisTemplate.expire(key, RedisConstants.LOGIN_USER_TTL, TimeUnit.MINUTES);

        // 9. 放行
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        UserHolder.removeUser();
    }
}
```

	如果用户登录了，时间到后会被强制下线

解决办法：再创建一个构造器，若用户登录了，直接放行

```java
@Configuration
public class MvcConfig implements WebMvcConfigurer {
    @Resource
    private StringRedisTemplate stringRedisTemplate;
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginInterceptor())
                .excludePathPatterns("/user/login"
                                ,"/user/code"
                                ,"/shop/**",
                                "/shop/type/**"
                                ,"/upload/**"
                                ,"/blog/hot").order(1);
        registry.addInterceptor(new RefreshTokenInterceptor(stringRedisTemplate))
                .addPathPatterns("/**").order(0);
    }
}
public class RefreshTokenInterceptor implements HandlerInterceptor {
    private final StringRedisTemplate stringRedisTemplate;

    public RefreshTokenInterceptor(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
        // 验证构造函数注入
        System.out.println("RefreshTokenInterceptor: stringRedisTemplate = " + stringRedisTemplate);
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1. 获取请求头中的 token
        String token = request.getHeader("authorization");
        if (StrUtil.isBlank(token)) {
            // token 缺失，放行
            return true;
        }

        // 2. 拼接 Redis 中的 key
        String key = LOGIN_USER_KEY + token;

        // 3. 检查 stringRedisTemplate 是否为 null
        if (stringRedisTemplate == null) {
            System.err.println("stringRedisTemplate is null in RefreshTokenInterceptor");
            response.setStatus(500); // Internal Server Error
            return true;
        }

        // 4. 查询 Redis 中的用户信息
        Map<Object, Object> userMap = stringRedisTemplate.opsForHash().entries(key);

        // 5. 判断是否存在用户信息
        if (userMap.isEmpty()) {
            // 用户信息不存在，拦截
            return true;
        }

        // 6. 将查询的 Hash 数据转为 UserDTO 对象
        UserDTO userDTO = BeanUtil.fillBeanWithMap(userMap, new UserDTO(), false);

        // 7. 保存用户信息到 ThreadLocal
        UserHolder.saveUser(userDTO);

        // 8. 刷新 token 有效期
        stringRedisTemplate.expire(key, RedisConstants.LOGIN_USER_TTL, TimeUnit.MINUTES);

        // 9. 放行
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        UserHolder.removeUser();
    }
}
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //判断ThreadLocal中是否有用户
        if(UserHolder.getUser() == null){
            response.setStatus(401);
            return false;
        }
        return true;
    }
}
```

LoginInterceptor 的主要功能是检查当前请求是否已通过认证  
RefreshTokenInterceptor 的主要功能是刷新token有效期

## 缓存
1. 缓存：数据交换的缓冲区，读写性能高

好处：降低后端负载

   提高读写效率，降低响应时间

缺点：数据一致性成本

   代码维护成本

   运维成本

2. 添加缓存

  ①从Redis中查找缓存②判断缓存是否存在③存在，直接返回④不存在使用mybatis查找⑤不存在，返回错误⑥存在，写入Redis

```java
public Result  queryWithPassThrough(Long id) {
        String key = CACHE_SHOP_KEY + id;
        String shopJSON = stringRedisTemplate.opsForValue().get(key);
        if(StrUtil.isNotBlank(shopJSON)){
            Shop shop = JSONUtil.toBean(shopJSON, Shop.class);
            return Result.ok(shop);
        }
        if(shopJSON == null){
            return Result.fail("店铺不存在");
        }
        Shop shop = getById(id);
        stringRedisTemplate.opsForValue().set(key,JSONUtil.toJsonStr(shop),CACHE_SHOP_TTL, TimeUnit.MINUTES);
        return shop;
    }
```

3. 缓存更新策略

| 对比项 | 内存淘汰 | 超时删除 | 主动更新 |
| --- | --- | --- | --- |
| **说明** | 不用自己维护，利用 Redis 的内存淘汰机制，当内存不足时自动淘汰部分数据。下次查询时更新缓存。 | 给缓存数据添加 TTL 时间，到期后自动删除缓存。下次查询时更新缓存。 | 编写业务逻辑，在修改数据库的同时，更新缓存。 |
| **一致性** | 差 | 一般 | 好 |
| **维护成本** | 无 | 低 | 高 |


低一致性需求：使用Redis自带的内存淘汰机制

高一致性需求：主动更新，并以超时剔除作为兜底方案（先更新数据库，再删除缓存）

4. 缓存穿透：客户端请求的数据在缓存中和数据库中都不存在，这样缓存永远不会生效，这些请求会直接打到数据库

解决办法：

①缓存空对象

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1746351503749-64ef9da9-a98f-4aa2-880c-491a1cded2da.png)

```java
public Shop queryWithPassThrough(Long id) {
        String key = CACHE_SHOP_KEY + id;
        String shopJSON = stringRedisTemplate.opsForValue().get(key);
        if(StrUtil.isNotBlank(shopJSON)){
            Shop shop = JSONUtil.toBean(shopJSON, Shop.class);
            return shop;
        }
        if(shopJSON == null){
            return null;
        }
        Shop shop = getById(id);
//缓存null
        if(shop == null){
            stringRedisTemplate.opsForValue().set(key,"",CACHE_NULL_TTL, TimeUnit.MINUTES);
            return null;
        }
        stringRedisTemplate.opsForValue().set(key,JSONUtil.toJsonStr(shop),CACHE_SHOP_TTL, TimeUnit.MINUTES);
        return shop;
    }
```

②布隆过滤

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1746351595519-2eca866a-4d15-43d7-b589-c96aa9020972.png)

5. 缓存雪崩：同一时段大量的缓存key同时失效或者Redis服务器宕机，导致大量请求到达数据库，带来巨大压力

解决方法：   ①给key设置不同的TTL

②利用Redis集群提高服务的可用性

③给缓存业务添加降级限流策略

④给业务添加多级缓存

6. 缓存击穿：缓存击穿问题也叫热点key问题，就是一个被高并发访问并且**缓存重建业务较复杂**的key突然失效了，无数的请求访问会在瞬间给数据库带来巨大的冲击

解决方法：①互斥锁

**定义：**在缓存失效后，为防止多个线程/请求同时去请求数据库，可以使用互斥锁来确保只有一个线程可以去更新缓存，其余的线程等待。

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1746360944483-1cc37453-1def-4a4d-931d-e27e21989c90.png)

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1746366620084-2eb88f2a-35df-42f8-8632-a5d453ffe6b5.png)



```java
//获取互斥锁
public boolean  tryLock(String key){
        Boolean flag = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", 10, TimeUnit.SECONDS);
        return BooleanUtil.isTrue(flag);
    }
//解锁
public void unlock(String key){
        stringRedisTemplate.delete(key);
    }
public Shop queryWithMutexLock(Long id){
        String key = CACHE_SHOP_KEY + id;
        //1.获取缓存
        String shopJSON = stringRedisTemplate.opsForValue().get(key);
        //2.判断是否存在
        if(StrUtil.isNotBlank(shopJSON)){
            //存在直接返回
            Shop shop = JSONUtil.toBean(shopJSON, Shop.class);
            return shop;
        }
        //3.判断缓存是否为空值
        if(shopJSON == null){
            //为空值直接返回
            return null;
        }
        //4.实现缓存重建
         //4.1获取互斥锁
        String lockKey = "lock:shop:" + id;
        Shop shop = null;
        try {
            boolean isLock= tryLock(lockKey);
            //4.2判断是否获取成功
            if(!isLock){
                //4.3失败，进入睡眠稍后重新尝试
                Thread.sleep(50);
                queryWithMutexLock(id);
            }
            //4.4成功查询数据库
            shop = getById(id);
            if(shop == null){
                stringRedisTemplate.opsForValue().set(key,"",CACHE_NULL_TTL, TimeUnit.MINUTES);
                return null;
            }
            //写入缓存
            stringRedisTemplate.opsForValue().set(key,JSONUtil.toJsonStr(shop),CACHE_SHOP_TTL, TimeUnit.MINUTES);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            unlock(lockKey);
        }
        return shop;
    }
```

   ②逻辑过期

  定义：缓存数据中加入一个逻辑的过期时间字段（如 `expireTime`），即使数据过期也仍保存在缓存中，由后台线程或请求者异步地更新缓存。  

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1746361105438-fb59a8ff-38be-4320-b5a6-1252c1411783.png)

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1746366585013-17b69409-b285-448e-8928-27c757684dd9.png)

```java
//写入缓存
    public void saveShopRedis(Long id,Long expireSeconds){
        //获取店铺信息
        Shop shop = getById(id);
        //封装过期时间
        RedisData redisDate = new RedisData();
        redisDate.setData(shop);
        redisDate.setExpireTime(LocalDateTime.now().plusSeconds(expireSeconds));
        //写入缓存
        stringRedisTemplate.opsForValue().set(CACHE_SHOP_KEY + id,JSONUtil.toJsonStr(redisDate));
    }
    //线程池
    private static final ExecutorService CACHE_REBUILD_EXECUTOR = Executors.newFixedThreadPool(10);
    public Shop queryWithLogicalExpire(Long id) {
        String key = CACHE_SHOP_KEY + id;
        String shopJSON = stringRedisTemplate.opsForValue().get(key);
        if(StrUtil.isBlank(shopJSON)){
            return null;
        }
        //命中，将JSON反序列化为对象
        RedisData redisDate = JSONUtil.toBean(shopJSON, RedisData.class);
        Shop shop = JSONUtil.toBean(JSONUtil.toJsonStr(redisDate.getData()), Shop.class);
        LocalDateTime expireTime = redisDate.getExpireTime();
        if(LocalDateTime.now().isAfter(expireTime)){
            //未过期
            return shop;
        }
        // 获取互斥锁
        String lockKey = LOCK_SHOP_KEY + id;
        boolean isLock = tryLock(lockKey);
        //判断是否获取锁成功
        if(isLock){
            //TODO 开启线程实现缓存重建
            CACHE_REBUILD_EXECUTOR.submit(()->{
                try {
                    //重建缓存
                    this.saveShopRedis(id,CACHE_SHOP_TTL);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                } finally {
                    //释放锁
                    unlock(lockKey);
                }

            });
        }
        //返回过期的缓存
        return shop;
    }

```

## 优惠券秒杀
1. 全局唯一ID

LocalDateTime.toEpochSecond()：将一个 对象转换为从 **1970-01-01 00:00:00 UTC**（即 Unix 纪元时间）开始到指定时间的**秒数**`LocalDateTime`（用来时间戳的生成）

`LocalDateTime.format()` 方法配合 可以将日期时间对象转换为指定格式的字符串 `DateTimeFormatter`

```java
@Resource
   private StringRedisTemplate stringRedisTemplate;
    //开始时间戳
    private static final long BEGIN_TIME = 1735689600L;
    //序列号位数
    private static final int COUNT_BIT = 32;
    public long nextId(String keyPrefix){
        //1.生成时间戳
        LocalDateTime localDateTime = LocalDateTime.now();
        long seconds = localDateTime.toEpochSecond(ZoneOffset.UTC);
        long timestamp = seconds - BEGIN_TIME;
        //2.生成序列号
        // 获取当天日期
        String date = localDateTime.format(DateTimeFormatter.ofPattern("yyyy:MM:dd"));
        //自增长
        Long count = stringRedisTemplate.opsForValue().increment("icr:" + keyPrefix + ":" + date);

        //3.拼接并返回

        return timestamp << COUNT_BIT | count;
    }
```



2. 秒杀优惠券

```java
        @Resource
        private ISeckillVoucherService seckillVoucherService;
        @Resource
        private RedisIdWorker redisIdWorker;
        @Resource
        private IVoucherOrderService voucherOrderService;
@Override
    @Transactional
    public Result seckillVoucher(Long voucherId) {
        //1.查询优惠券
        SeckillVoucher voucher = seckillVoucherService.getById(voucherId);
        //2.判断秒杀是否开始
        if(voucher.getBeginTime().isAfter(LocalDateTime.now())){
            return Result.fail("秒杀还未开始！");
        }
        //3.判断秒杀是否结束
        if(voucher.getEndTime().isBefore(LocalDateTime.now())){
            return Result.fail("秒杀已经结束!");
        }
        //4.判断库存是否充足
        if(voucher.getStock() <= 0){
            return Result.fail("优惠券库存不足！");
        }
        //5.扣减库存
        boolean success = seckillVoucherService.update().setSql("stock = stock - 1").eq("voucher_id",voucherId).update();
        if(!success){
            return Result.fail("优惠券库存不足");
        }
        //6.创建订单
        //订单id
        VoucherOrder voucherOrder = new VoucherOrder();
        long orderId = redisIdWorker.nextId("order");
        voucherOrder.setId(orderId);
        //优惠券id
        voucherOrder.setVoucherId(voucherId);
        //用户id
        Long userId = UserHolder.getUser().getId();
        voucherOrder.setUserId(userId);
        //7.返回订单id
        voucherOrderService.save(voucherOrder);
        return Result.ok(orderId);
    }
```

3. 多线程超卖问题

解决办法：乐观锁

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1746436340486-ab1242ca-0831-4e70-8ccd-427066ac36fb.png)



在更新数据库前检查库存量

```java
boolean success = seckillVoucherService.update().setSql("stock = stock - 1")
                .eq("voucher_id",voucherId).gt("stock",0).update();
```

4. 一人一单
5. 集群下的线程并发安全问题

集群打开方式，在IDEA中选中启动项按CTRL + D，并在Nginx中设置新的集群

解决办法：分布式锁

分布式锁：满足分布式系统或集群模式下多进程可见并且相互排斥的锁

```java
public class SimpleRedisLock implements ILock{
    private StringRedisTemplate stringRedisTemplate;
    private static final String KEY_PREFIX = "lock:";
    private static final String ID_PREFIX = UUID.randomUUID().toString(true) + "-";
    private String name;

    public SimpleRedisLock(String name, StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.name = name;
    }

    @Override
    public boolean tryLock(long timeOutSec) {
        String threadId = ID_PREFIX +  Thread.currentThread().getId();
        Boolean success = stringRedisTemplate.opsForValue().setIfAbsent(KEY_PREFIX + name,  threadId, timeOutSec, TimeUnit.SECONDS);
        return Boolean.TRUE.equals(success);
    }

    @Override
    public void unlock() {
        String threadId = ID_PREFIX +  Thread.currentThread().getId();
        String id = stringRedisTemplate.opsForValue().get(KEY_PREFIX + name);
        //增加判断标识，防止锁被误删
        if(threadId.equals(id)){
            stringRedisTemplate.delete(KEY_PREFIX + name);
        }

    }
}
```

6. Lua脚本，保证Redis多条命令执行的原子性

 	Lua脚本的启动

```java
//需要先定义DefaultRedisScript对象
private static final DefaultRedisScript<Long> SECKILL_SCRIPT;
//通过static块来设置资源路径和结果类型初始化
static {
       SECKILL_SCRIPT = new DefaultRedisScript<>();
       SECKILL_SCRIPT.setLocation(new ClassPathResource("seckill.lua"));
       SECKILL_SCRIPT.setResultType(Long.class);
   }
//执行Lua脚本
stringRedisTemplate.execute(
    //DefaultRedisScript对象
    SECKILL_SCRIPT,
    //List集合（传入Keys）
    Collections.emptyList(),
    //传入ARGV数组
    voucherId.toString()
);

```

7. Redission

①![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1746619082292-2f8bb2e2-9da9-4146-ad43-9aa4b8d9fa04.png)

②multiLock

8. 基于阻塞队列实现异步秒杀

阻塞队列：会等待消息进入队列

```java
@Resource
    private ISeckillVoucherService seckillVoucherService;
    @Resource
    private RedisIdWorker redisIdWorker;
    /**
     * 自己注入自己为了获取代理对象 @Lazy 延迟注入 避免形成循环依赖
     */
    @Resource
    @Lazy
    private IVoucherOrderService voucherOrderService;
    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    @Resource
    private RedissonClient redissonClient;
    private static final DefaultRedisScript<Long> SECKILL_SCRIPT;
    static{
        SECKILL_SCRIPT = new DefaultRedisScript<>();
        SECKILL_SCRIPT.setLocation(new ClassPathResource("seckill.lua"));
        SECKILL_SCRIPT.setResultType(Long.class);
        log.info("Lua脚本加载完成: {}", SECKILL_SCRIPT.getScriptAsString());
    }
    
    @PostConstruct
    public void checkRedisKeys() {
        // 启动时检查一些关键的Redis键
        try {
            String stockKey = RedisConstants.SECKILL_STOCK_KEY + "10"; // 检查ID为10的库存键
            String stock = stringRedisTemplate.opsForValue().get(stockKey);
            log.info("系统启动时检查: 优惠券10的库存为 {}", stock);
        } catch (Exception e) {
            log.error("Redis连接检查失败", e);
        }
    }
    private BlockingQueue<VoucherOrder> orderTasks = new LinkedBlockingQueue<>(1024 * 1024);
    private static final ExecutorService SECKILL_ORDER_EXECUTOR = Executors.newSingleThreadExecutor();
    //项目启动后就执行这个线程
    @PostConstruct
    public void init(){
        SECKILL_ORDER_EXECUTOR.submit(new VoucherOrderHandler());
    }
    class VoucherOrderHandler implements Runnable{
        @Override
        public void run() {
            while (true){
                try {
                    VoucherOrder voucherOrder = orderTasks.take();
                    handlerVoucherOrder(voucherOrder);
                } catch (InterruptedException e) {
                   log.error("订单异常",e);
                }
            }
        }
    }
    private IVoucherOrderService proxy;
    private void handlerVoucherOrder(VoucherOrder voucherOrder) {
        //获取用户
        Long userId = voucherOrder.getUserId();
        log.info("开始处理异步订单: userId={}, voucherId={}", userId, voucherOrder.getVoucherId());
        
        //创建锁对象
        RLock lock = redissonClient.getLock(RedisConstants.LOCK_ORDER_KEY + userId);
        //获取锁
        boolean isLock = lock.tryLock();
        if(!isLock){
            log.error("一人仅允许下一单");
            return; // 获取锁失败要及时返回
        }
        
        try {
            // 检查订单是否已经存在
            int count = query()
                    .eq("user_id", userId)
                    .eq("voucher_id", voucherOrder.getVoucherId())
                    .count();
                    
            if (count > 0) {
                log.error("用户 {} 已购买过优惠券 {}", userId, voucherOrder.getVoucherId());
                return;
            }
            
            // 直接在数据库中扣减库存
            boolean success = seckillVoucherService.update()
                    .setSql("stock = stock - 1")
                    .eq("voucher_id", voucherOrder.getVoucherId())
                    .gt("stock", 0) // 确保库存充足
                    .update();
                    
            if (!success) {
                log.error("数据库扣减库存失败");
                return;
            }
            
            // 创建订单记录
            boolean saved = save(voucherOrder);
            log.info("异步订单处理完成: orderId={}, 保存结果={}", voucherOrder.getId(), saved);
            
        } catch (Exception e) {
            log.error("处理订单异常", e);
        } finally {
            lock.unlock();
        }
    }

    /**
     * 秒杀优惠券
     *
     * @param voucherId 券id
     * @return {@link Result}
     */

    @Override
    public Result seckillVoucher(Long voucherId){
        // 使用Lua脚本实现秒杀，确保原子性操作
        
        // 1. 获取用户ID
        Long userId = UserHolder.getUser().getId();
        log.info("用户{}开始秒杀优惠券{}", userId, voucherId);
        
        // 2. 检查并确保Redis中有库存
        String stockKey = RedisConstants.SECKILL_STOCK_KEY + voucherId;
        String stockStr = stringRedisTemplate.opsForValue().get(stockKey);
        
        if (stockStr == null) {
            // 如果Redis中没有库存信息，从数据库加载
            SeckillVoucher voucher = seckillVoucherService.getById(voucherId);
            if (voucher == null || voucher.getStock() <= 0) {
                return Result.fail("优惠券不存在或库存不足");
            }
            
            // 将库存保存到Redis
            stringRedisTemplate.opsForValue().set(stockKey, voucher.getStock().toString());
            log.info("从数据库加载库存: {}", voucher.getStock());
        }
        
        // 6. 使用Lua脚本保证操作的原子性
        try {
            // 执行Lua脚本
            Long result = stringRedisTemplate.execute(
                    SECKILL_SCRIPT,
                    Collections.emptyList(),  // KEYS列表为空
                    voucherId.toString(), userId.toString()  // ARGV参数列表
            );
            
            // 判断结果
            if (result == null) {
                log.error("Lua脚本执行失败，返回null");
                return Result.fail("下单失败");
            }
            
            int resultCode = result.intValue();
            if (resultCode != 0) {
                if (resultCode == 1) {
                    log.info("库存不足");
                    return Result.fail("库存不足");
                } else if (resultCode == 2) {
                    log.info("用户{}重复下单", userId);
                    return Result.fail("不能重复下单");
                } else {
                    log.error("Lua脚本返回未知错误码: {}", resultCode);
                    return Result.fail("下单失败");
                }
            }
            
            log.info("Lua脚本执行成功，用户{}秒杀优惠券{}成功", userId, voucherId);
            
        } catch (Exception e) {
            log.error("执行Lua脚本异常", e);
            return Result.fail("系统异常，请重试");
        }
        
        // 7. 创建订单
        VoucherOrder voucherOrder = new VoucherOrder();
        long orderId = redisIdWorker.nextId("order");
        voucherOrder.setId(orderId);
        voucherOrder.setUserId(userId);
        voucherOrder.setVoucherId(voucherId);
        
        // 8. 将订单信息放入队列
        orderTasks.add(voucherOrder);
        log.info("订单已加入队列，订单号: {}", orderId);
        
        // 9. 返回订单ID
        return Result.ok(orderId);
    }
    
//    /**
//     * 当Lua脚本失败时的备选方案
//     */
//    private Result fallbackToDirectOrder(Long voucherId, Long userId) {
//        log.info("使用备选方案下单");
//
//        // 定义Redis键
//        String stockKey = RedisConstants.SECKILL_STOCK_KEY + voucherId;
//        String orderKey = "seckill:order:" + voucherId;
//
//        // 1. 判断是否重复下单
//        Boolean ordered = stringRedisTemplate.opsForSet().isMember(orderKey, userId.toString());
//        if (Boolean.TRUE.equals(ordered)) {
//            return Result.fail("不能重复下单");
//        }
//
//        // 2. 判断库存是否充足
//        String stockStr = stringRedisTemplate.opsForValue().get(stockKey);
//        int stock = 0;
//        try {
//            stock = Integer.parseInt(stockStr);
//        } catch (Exception e) {
//            // 恢复库存
//            SeckillVoucher voucher = seckillVoucherService.getById(voucherId);
//            if (voucher != null && voucher.getStock() > 0) {
//                stock = voucher.getStock();
//                stringRedisTemplate.opsForValue().set(stockKey, stock + "");
//            }
//        }
//
//        if (stock <= 0) {
//            return Result.fail("库存不足");
//        }
//
//        // 3. 扣减库存
//        stringRedisTemplate.opsForValue().decrement(stockKey);
//
//        // 4. 记录用户下单
//        stringRedisTemplate.opsForSet().add(orderKey, userId.toString());
//
//        // 5. 创建订单
//        VoucherOrder voucherOrder = new VoucherOrder();
//        long orderId = redisIdWorker.nextId("order");
//        voucherOrder.setId(orderId);
//        voucherOrder.setUserId(userId);
//        voucherOrder.setVoucherId(voucherId);
//
//        // 6. 添加到异步队列
//        orderTasks.add(voucherOrder);
//
//        return Result.ok(orderId);
//    }
    @Transactional(rollbackFor = Exception.class)
    public void createVoucherOrder(VoucherOrder voucherOrder) {
        //是否下单
        Long userId = UserHolder.getUser().getId();
        int count = query().eq("user_id",userId).eq("voucher_id",voucherOrder.getVoucherId()).count();
        if (count > 0) {
            log.error("禁止重复购买");
            return;
        }
        //扣减库存
        boolean isSuccess = seckillVoucherService.update()
                .setSql("stock = stock - 1")
                .eq("voucher_id",voucherOrder.getVoucherId()).update();
        if (!isSuccess) {
            //库存不足
            log.error("库存不足");
            return;
        }
        //创建订单
        this.save(voucherOrder);
    }
```

9. 消息队列实现秒杀

消息队列：存储和管理消息，也被称为消息代理

生产者：发送消息到消息队列

消费者：从消息队列获取消息并处理消息

①Redis中的list实现消息队列

②PubSub实现消息队列：消费者可以订阅多个生产者

```java
SUBSCRlBE channel[channel]:订阅一个或多个频道
PUBLISH channel msg:向一个频道发送消息PSUBSCRlBE
PSUBSCRIBE pattern[pattern]:订阅与pattern格式匹配的所有频道
```

	example：

```java
1:PSUBSCRIBE order.*
2:SUBSCIRBE order.q2
3:PUBLISH order.q2
//3发送消息给order.q2频道，1，2都能接收到，但若是发送给order.q3只有1能接收到
```

关系如下图

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1746870244763-c2bb427e-a423-4512-b954-27fdfec1b7c7.png)

③Streams实现的消息队列

发送消息命令：

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1746870502887-3d096dce-447b-4769-b556-731cddd31e5d.png)

最简命令：

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1746870494715-f7dba118-6f55-49ed-ac83-5f97bd004f1b.png)	读取信息命令：

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1746870891127-4cf7db6e-6fd7-409c-9f65-b44894955c35.png)

最简命令

```java
XREAD COUNT 1 BLOCK 0 STREAMS s1 $
```

创建消费者组

```java
XGROUP CREATE key groupName ID [MKSFREAM]
```

+ key:队列名称
+ groupName:消费者组名称
+ ID:起始ID标示，$代表队列中最后一个消息，0则代表队列中第一个消息
+ MKSTREAM:队列不存在时自动创建队列

简单指令

```java
XGROUP CREATE s1 g1 0
```

从消费者读取信息

```java
XREADGROUP GROUP group consumer [COUNT count] [BLOCK milliseconds] [NOACK] STREAMS key [key ...] ID [ID ...]
```

+ `**GROUP group consumer**`
+ 指定消费者组名称（group）和消费者名称（consumer）；
+ 如果消费者不存在，Redis 会自动创建。
+ `**COUNT count**`
+ 指定一次最多读取多少条消息（可选）。
+ `**BLOCK milliseconds**`
+ 如果没有新消息，阻塞等待的最大时间（单位毫秒），0 表示无限等待。
+ `**NOACK**`
+ 自动确认，获取到消息后不需要手动执行 `XACK`；
+ 否则需要你手动 `XACK` 进行确认，确保可靠消息处理。
+ `**STREAMS key [key ...]**`
+ 指定读取的 Stream 队列名（可以是多个）。
+ `**ID [ID ...]**`
+ 指定每个 Stream 从哪条消息开始读。
    - `>`：从下一个未消费的新消息开始；
    - 其他值（如 `0`）：表示从 pending-list 中获取已分配但未确认的消息。

<font style="background-color:#FBDE28;">消费者在获取到消息后，消息会处于pending状态，并存入pending-list。当处理完消息后通过XACK来确认消息，标记为已处理，处理后的消息会从pending-list移除</font>

简单指令

```java
XREADGROUP GROUP g1(消费者组) c1(消费者名称) COUNT 1 BLOCK 0 STREAMS s1 >
```

 消息队列实现秒杀

伪代码：

![](https://cdn.nlark.com/yuque/0/2025/png/42958719/1746880376651-7557af2a-031a-4e14-a6cc-6fc547d0d352.png)

```java
@Resource
    private ISeckillVoucherService seckillVoucherService;

    @Resource
    private RedisIdWorker redisIdWorker;

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Resource
    private RedissonClient redissonClient;

    /**
     * 当前类初始化完毕就立马执行该方法
     */
    @PostConstruct
    private void init() {
        // 执行线程任务
        SECKILL_ORDER_EXECUTOR.submit(new VoucherOrderHandler());
    }


    /**
     * 线程池
     */
    private static final ExecutorService SECKILL_ORDER_EXECUTOR = Executors.newSingleThreadExecutor();

    /**
     * 队列名
     */
    private static final String queueName = "stream.orders";

    /**
     * 线程任务: 不断从消息队列中获取订单
     */
    private class VoucherOrderHandler implements Runnable {
        @Override
        public void run() {
            while (true) {
                try {
                    // 尝试读取消息队列
                    List<MapRecord<String, Object, Object>> messageList = stringRedisTemplate.opsForStream().read(
                            Consumer.from("g1", "c1"),
                            StreamReadOptions.empty().count(1).block(Duration.ofSeconds(2)),
                            StreamOffset.create(queueName, ReadOffset.lastConsumed())
                    );
                    // 2、判断消息获取是否成功
                    if (messageList == null || messageList.isEmpty()) {
                        // 2.1 消息获取失败，说明没有消息，进入下一次循环获取消息
                        continue;
                    }
                    // 3、消息获取成功，可以下单
                    // 将消息转成VoucherOrder对象
                    MapRecord<String, Object, Object> record = messageList.get(0);
                    Map<Object, Object> messageMap = record.getValue();
                    VoucherOrder voucherOrder = BeanUtil.fillBeanWithMap(messageMap, new VoucherOrder(), true);
                    handleVoucherOrder(voucherOrder);
                    // 4、ACK确认 SACK stream.orders g1 id
                    stringRedisTemplate.opsForStream().acknowledge(queueName, "g1", record.getId());
                    
                } catch (Exception e) {
                    log.info("处理异常订单");
                    // 处理积压消息
                    handlePendingList();
                }
            }
        }
    }

    private void handlePendingList() {
        while (true) {
            try {
                // 1、从pendingList中获取订单信息 XREADGROUP GROUP g1 c1 COUNT 1 BLOCK 1000 STREAMS streams.order 0
                List<MapRecord<String, Object, Object>> messageList = stringRedisTemplate.opsForStream().read(
                        Consumer.from("g1", "c1"),
                        StreamReadOptions.empty().count(1).block(Duration.ofSeconds(1)),
                        StreamOffset.create(queueName, ReadOffset.from("0"))
                );
                // 2、判断pendingList中是否有效性
                if (messageList == null || messageList.isEmpty()) {
                    // 2.1 pendingList中没有消息，直接结束循环
                    break;
                }
                // 3、pendingList中有消息
                // 将消息转成VoucherOrder对象
                MapRecord<String, Object, Object> record = messageList.get(0);
                Map<Object, Object> messageMap = record.getValue();
                VoucherOrder voucherOrder = BeanUtil.fillBeanWithMap(messageMap, new VoucherOrder(), true);
                handleVoucherOrder(voucherOrder);
                // 4、ACK确认 SACK stream.orders g1 id
                stringRedisTemplate.opsForStream().acknowledge(queueName, "g1", record.getId());
            } catch (Exception e) {
                log.error("处理订单异常", e);
                // 这里不用调自己，直接就进入下一次循环，再从pendingList中取，这里只需要休眠一下，防止获取消息太频繁
                try {
                    Thread.sleep(20);
                } catch (InterruptedException ex) {
                    log.error("线程休眠异常", ex);
                }
            }
        }
    }

    private void handleVoucherOrder(VoucherOrder voucherOrder) {
        Long userId = voucherOrder.getUserId();
        Long voucherId = voucherOrder.getVoucherId();
        
        RLock lock = redissonClient.getLock(RedisConstants.LOCK_ORDER_KEY + userId);
        boolean isLock = lock.tryLock();
        
        if (!isLock) {
            log.error("一人只能下一单");
            return;
        }
        
        try {
            proxy.createVoucherOrder(voucherOrder);
        }finally {
            lock.unlock();
            log.info("释放锁完成");
        }
    }

    /**
     * 加载 判断秒杀券库存是否充足 并且 判断用户是否已下单 的Lua脚本
     */
    private static final DefaultRedisScript<Long> SECKILL_SCRIPT;

    static {
        SECKILL_SCRIPT = new DefaultRedisScript<>();
        SECKILL_SCRIPT.setLocation(new ClassPathResource("seckill.lua"));
        SECKILL_SCRIPT.setResultType(Long.class);
    }

    /**
     * VoucherOrderServiceImpl类的代理对象
     * 将代理对象的作用域进行提升，方面子线程取用
     */
    private IVoucherOrderService proxy;
    /**
     * 抢购秒杀券
     *
     * @param voucherId
     * @return
     */
    @Override
    public Result seckillVoucher(Long voucherId) {
        Long userId = UserHolder.getUser().getId();
        long orderId = redisIdWorker.nextId(SECKILL_VOUCHER_ORDER);

        // 1、执行Lua脚本，判断用户是否具有秒杀资格
        Long result = null;
        try {
            result = stringRedisTemplate.execute(
                    SECKILL_SCRIPT,
                    Collections.emptyList(),
                    voucherId.toString(),
                    userId.toString(),
                    String.valueOf(orderId)
            );
        } catch (Exception e) {
            log.error("Lua脚本执行失败");
            throw new RuntimeException(e);
        }
        if (result != null && !result.equals(0L)) {
            // result为1表示库存不足，result为2表示用户已下单
            int r = result.intValue();
            return Result.fail(r == 2 ? "不能重复下单" : "库存不足");
        }

        // 2、result为0，下单成功，直接返回ok
        // 索取锁成功，创建代理对象，使用代理对象调用第三方事务方法， 防止事务失效
        IVoucherOrderService proxy = (IVoucherOrderService) AopContext.currentProxy();
        this.proxy = proxy;
        return Result.ok(orderId);
    }

    /**
     * 创建订单
     *
     * @param voucherOrder
     * @return
     */
    @Transactional
    @Override
    public void createVoucherOrder(VoucherOrder voucherOrder) {
        Long userId = voucherOrder.getUserId();
        Long voucherId = voucherOrder.getVoucherId();
        
        // 1、判断用户是否已购买过此优惠券
        int count = this.count(new LambdaQueryWrapper<VoucherOrder>()
                .eq(VoucherOrder::getUserId, userId)
                .eq(VoucherOrder::getVoucherId, voucherId));
        
        if (count >= 1) {
            log.error("用户{}已购买过优惠券{}", userId, voucherId);
            throw new RuntimeException("不能重复购买同一优惠券");
        }
        
        // 2、更新秒杀券库存
        boolean updateSuccess = seckillVoucherService.update(new LambdaUpdateWrapper<SeckillVoucher>()
                .eq(SeckillVoucher::getVoucherId, voucherId)
                .gt(SeckillVoucher::getStock, 0)
                .setSql("stock = stock - 1"));
        
        if (!updateSuccess) {
            throw new RuntimeException("库存不足或更新失败");
        }

        
        // 3、创建订单
        boolean saveSuccess = this.save(voucherOrder);
        if (!saveSuccess) {
            throw new RuntimeException("创建订单失败");
        }
    }
```

总结：总体思路是创建一个线程来实现消息队列，然后执行Lua脚本进行下单

| 特性 | List | PubSub | Stream |
| --- | --- | --- | --- |
| 消息持久化 | ✅ 支持 | ❌ 不支持 | ✅ 支持 |
| 阻塞读取 | ✅ 支持 | ✅ 支持 | ✅ 支持 |
| 消息堆积处理 | ✅ 受限于内存空间，可多消费者处理 | ⚠️ 受限于消费者缓冲区 | ✅ 受限于队列长度，可用消费者组提升消费速度，减少堆积 |
| 消息确认机制 | ❌ 不支持 | ❌ 不支持 | ✅ 支持（ACK机制） |
| 消息回溯 | ❌ 不支持 | ❌ 不支持 | ✅ 支持（可根据ID读取历史消息） |


## 达人探店
1. GEO数据结构实现附近商户搜索

GEO指令：

```java
GEOADD key 经度 纬度 member(通常是地点名)
//GEOADD g1 116.378248 39.865275 bjn 116.42803 39.903738 bjz 116.322287 39.893729 bjx
```

```java
GEODIST key member1 member2 Unit(m/km)
//GEODIST g1 bjn bjx km
```

2. BitMap数据结构

BitMap使用String实现的因此在Java中opsForValue()就行

SETBIT key 位数 [0/1]   
GETBIT key 位数

BITFILED

```java
SETBIT bm 0 1//设置第0位为1
GETBIT bm 0//获取第0位的值，获得结果是1
```

3. hyperLogLog数据结构

UV(Unique Visitor):统计被多少个用户访问，一天内同一个用户访问多次仅记为一次

PV(Page View):统计网页被点击次数

PFADD key element添加指定元素到HyperLogLog

PFCOUNT key返回给定HyperLogLog的技术估计值

