
### 1. Command Pattern

*   **Định nghĩa:** Đóng gói một yêu cầu (request) như một đối tượng, qua đó cho phép tham số hóa các client với các yêu cầu khác nhau, sắp xếp hoặc lưu trữ các yêu cầu, và hỗ trợ các thao tác có thể hoàn tác (undo).
*   **Vận dụng trong Cocos Creator:**
    *   Xử lý input của người dùng (phím, chuột, UI button) một cách tách biệt.
    *   Quản lý các hành động của nhân vật hoặc đối tượng game.
    *   Tiềm năng cho hệ thống replay hoặc undo/redo.
*   **Ví dụ:**
    *   Người chơi nhấn nút "Tấn công" trên UI hoặc phím "Space". Cả hai đều có thể tạo ra một đối tượng `AttackCommand`. Đối tượng này sau đó được truyền đi để thực thi logic tấn công.
    ```javascript
    // Conceptual AttackCommand
    class AttackCommand {
        constructor(target) {
            this.target = target;
        }
        execute() {
            // Logic tấn công mục tiêu
            console.log(`Attacking ${this.target.name}`);
        }
        undo() {
            // Logic hoàn tác (nếu có)
        }
    }
    // Trong Component của Player
    onAttackButtonPressed() {
        const command = new AttackCommand(this.currentTarget);
        this.commandQueue.add(command);
        command.execute();
    }
    ```
*   **Lợi ích & Cảm nhận:**
    *   Tách biệt người khởi tạo yêu cầu (ví dụ: UI button) khỏi người thực thi yêu cầu (ví dụ: logic tấn công của nhân vật).
    *   Code dễ quản lý, dễ mở rộng (thêm command mới mà không ảnh hưởng nhiều đến code cũ).
    *   Tạo nền tảng cho các tính năng phức tạp như undo/redo.

### 2. Flyweight Pattern

*   **Định nghĩa:** Giảm thiểu việc sử dụng bộ nhớ bằng cách chia sẻ càng nhiều dữ liệu càng tốt với các đối tượng tương tự. Nó tách phần trạng thái cố định (intrinsic) của đối tượng, có thể được chia sẻ, ra khỏi phần trạng thái thay đổi (extrinsic).
*   **Vận dụng trong Cocos Creator:**
    *   Tối ưu hóa việc hiển thị số lượng lớn các đối tượng giống hệt nhau (ví dụ: đạn, cây cối, gạch, kẻ địch cùng loại).
    *   Quản lý tài nguyên hiệu quả hơn.
*   **Ví dụ:**
    *   Trong game bắn súng, có hàng trăm viên đạn. Thay vì mỗi viên đạn lưu trữ thông tin về hình ảnh, tốc độ, sát thương (intrinsic state), chúng ta có thể tạo một "BulletType" chứa các thông tin này. Mỗi instance viên đạn trên màn hình chỉ cần lưu vị trí, hướng di chuyển (extrinsic state) và tham chiếu đến "BulletType" tương ứng.
    ```javascript
    // Intrinsic State (shared)
    class BulletFlyweight {
        constructor(spriteFrame, speed, damage) {
            this.spriteFrame = spriteFrame;
            this.speed = speed;
            this.damage = damage;
        }
    }

    // Flyweight Factory
    class BulletFactory {
        constructor() {
            this.flyweights = {};
        }
        getFlyweight(type) {
            if (!this.flyweights[type]) {
                // Load config for this bullet type
                if (type === 'basic') {
                    this.flyweights[type] = new BulletFlyweight(spriteFrameBasic, 100, 10);
                } else if (type === 'heavy') {
                    this.flyweights[type] = new BulletFlyweight(spriteFrameHeavy, 50, 50);
                }
            }
            return this.flyweights[type];
        }
    }
    ```
*   **Lợi ích & Cảm nhận:**
    *   Tiết kiệm bộ nhớ đáng kể, cải thiện hiệu năng, đặc biệt trên thiết bị di động.
    *   Prefab trong Cocos cũng giúp tối ưu, nhưng Flyweight có thể áp dụng sâu hơn ở tầng logic dữ liệu.

### 3. Observer Pattern (Publish/Subscribe)

*   **Định nghĩa:** Định nghĩa một sự phụ thuộc một-nhiều giữa các đối tượng để khi một đối tượng thay đổi trạng thái, tất cả các đối tượng phụ thuộc vào nó sẽ được thông báo và cập nhật tự động.
*   **Vận dụng trong Cocos Creator:**
    *   Hệ thống event tích hợp sẵn: `this.node.on('event-name', callback, target)` và `this.node.emit('event-name', data)`.
    *   Tạo event bus toàn cục để các module không liên quan trực tiếp có thể giao tiếp với nhau.
*   **Ví dụ:**
    *   Khi máu của Player giảm xuống 0, Node Player `emit` một sự kiện `PLAYER_DIED`. GameManager và UIManager đã `on` sự kiện này sẽ nhận được thông báo để xử lý (hiển thị màn hình Game Over, dừng game).
    ```javascript
    // Trong Player Component
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.node.emit('PLAYER_DIED', { score: this.currentScore });
        }
    }

    // Trong GameManager Component
    onLoad() {
        // Giả sử có cách để lấy node Player
        playerNode.on('PLAYER_DIED', this.onPlayerDied, this);
    }
    onPlayerDied(eventData) {
        console.log(`Game Over! Final Score: ${eventData.score}`);
        // Logic dừng game, lưu điểm...
    }
    ```
*   **Lợi ích & Cảm nhận:**
    *   Giảm sự phụ thuộc trực tiếp giữa các đối tượng (loose coupling).
    *   Code dễ mở rộng, các module có thể hoạt động độc lập và chỉ phản ứng với các sự kiện chúng quan tâm.
    *   `EventEmitter` của Node.js (có thể tích hợp) là một công cụ mạnh để tạo event bus toàn cục.

### 4. State Pattern

*   **Định nghĩa:** Cho phép một đối tượng thay đổi hành vi của nó khi trạng thái nội tại của nó thay đổi. Đối tượng sẽ xuất hiện như thể nó đã thay đổi lớp của mình.
*   **Vận dụng trong Cocos Creator:**
    *   Quản lý các trạng thái khác nhau của nhân vật (đứng yên, di chuyển, nhảy, tấn công).
    *   Xây dựng AI cho kẻ địch (tuần tra, truy đuổi, tấn công, rút lui).
*   **Ví dụ:**
    *   Nhân vật có thể ở trạng thái `IdleState`, `WalkingState`, `JumpingState`. Mỗi state là một đối tượng riêng, chứa logic `update()` và các điều kiện để chuyển sang state khác.
    ```javascript
    // Conceptual States
    class IdleState {
        constructor(character) { this.character = character; }
        enter() { this.character.playAnimation('idle'); }
        update(dt) {
            if (this.character.input.moveX !== 0) {
                this.character.setState(new WalkingState(this.character));
            }
        }
        exit() {}
    }
    class WalkingState {
        constructor(character) { this.character = character; }
        enter() { this.character.playAnimation('walk'); }
        update(dt) {
            // Logic di chuyển
            if (this.character.input.moveX === 0) {
                this.character.setState(new IdleState(this.character));
            }
        }
        exit() {}
    }
    
    ```
*   **Lợi ích & Cảm nhận:**
    *   Tránh các khối `if/else` hoặc `switch/case` phức tạp để quản lý trạng thái.
    *   Mỗi trạng thái có logic riêng, dễ hiểu và dễ bảo trì.
    *   Dễ dàng thêm trạng thái mới.

### 5. Singleton Pattern

*   **Định nghĩa:** Đảm bảo một lớp chỉ có một instance duy nhất và cung cấp một điểm truy cập toàn cục đến instance đó.
*   **Vận dụng trong Cocos Creator:**
    *   Quản lý các hệ thống toàn cục như `AudioManager`, `GameManager` (điểm số, level), `ResourceManager`, `InputManager`.
*   **Ví dụ:**
    *   Tạo một `AudioManager` để quản lý tất cả âm thanh trong game, có thể truy cập từ bất kỳ đâu để phát nhạc nền hoặc hiệu ứng âm thanh.
    ```javascript
    let instance = null;
    class AudioManager {
        constructor() {
            if (instance) {
                return instance;
            }
            instance = this;
            // Khởi tạo âm thanh...
            console.log("AudioManager initialized");
        }
        playSound(clipName) { /* ... */ }
        playMusic(clipName) { /* ... */ }
    }
    module.exports = new AudioManager();

    
    ```
*   **Lợi ích & Cảm nhận:**
    *   Cung cấp điểm truy cập tiện lợi cho các dịch vụ dùng chung.
    *   Đảm bảo chỉ có một thể hiện của các manager quan trọng.
    *   Trong Cocos, có thể dùng node persistent hoặc module JavaScript.
    *   **Lưu ý:** Cần cẩn trọng để không lạm dụng, vì có thể làm tăng sự phụ thuộc và khó khăn cho việc unit test.

---
