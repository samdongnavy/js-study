import random

def get_3d_coords(num):
    # 1~27 번호를 (x, y, z) 좌표(각각 0~2)로 역변환
    z, rem = divmod(num - 1, 9)
    y, x = divmod(rem, 3)
    return x, y, z

def get_distance_3d(n1, n2):
    # 두 지점 간 맨해튼 거리 계산
    x1, y1, z1 = get_3d_coords(n1)
    x2, y2, z2 = get_3d_coords(n2)
    return abs(x1 - x2) + abs(y1 - y2) + abs(z1 - z2)

def print_numbered_lattice(guessed, target, reveal_target=False):
    print("\n========================= [3D 풀 격자 레이더 - 단일 번호 지정형] =========================")
    print("                             (1~9: 앞면 / 10~18: 중간면 / 19~27: 뒷면)")
    
    # 26행 65열 캔버스
    canvas = [[' ' for _ in range(65)] for _ in range(26)]
    
    # 1. 3D 격자 뼈대 그리기
    for z in range(3):
        for y in range(3):
            for x in range(3):
                r = y * 6 - z * 4 + 10
                c = x * 14 + z * 8 + 4
                
                if x < 2:
                    for i in range(2, 14):
                        if canvas[r][c + i] == ' ': canvas[r][c + i] = '-'
                if y < 2:
                    for i in range(1, 6):
                        if canvas[r + i][c] == ' ': canvas[r + i][c] = '|'
                if z < 2:
                    if canvas[r - 1][c + 2] == ' ': canvas[r - 1][c + 2] = '/'
                    if canvas[r - 2][c + 4] == ' ': canvas[r - 2][c + 4] = '/'
                    if canvas[r - 3][c + 6] == ' ': canvas[r - 3][c + 6] = '/'

    # 2. 번호 및 마커 덮어쓰기
    for z in range(3):
        for y in range(3):
            for x in range(3):
                r = y * 6 - z * 4 + 10
                c = x * 14 + z * 8 + 4
                num = z * 9 + y * 3 + x + 1
                
                # 정답 공개 조건 우선 적용 (T가 X에 덮이지 않도록 수정)
                if reveal_target and num == target:
                    char = " T"
                elif num in guessed:
                    char = " X"
                else:
                    char = f"{num:2d}"
                    
                canvas[r][c] = char[0]
                canvas[r][c + 1] = char[1]

    # 캔버스 출력
    for row in canvas:
        line = "".join(row).rstrip()
        if line:
            print("    " + line)
    print("==========================================================================================\n")

def play_game():
  
    print("\n=== 번호 지정형 3D 보물찾기 ===")
    print("1번부터 27번 사이의 공간 중 단 1곳에 보물이 숨겨져 있습니다.")
    
    target = random.randint(1, 27)
    max_attempts = 7
    attempts = 0
    guessed = set()

    while attempts < max_attempts:
        print_numbered_lattice(guessed, target, reveal_target=False)
        
        try:
            inp = input(f"(시도 {attempts+1}/{max_attempts}) 탐색할 번호 입력 (1~27): ")
            num = int(inp)
            
            if not (1 <= num <= 27):
                print("1부터 27 사이의 번호를 입력하세요.")
                continue
                
            if num in guessed:
                print("이미 탐색한 번호입니다. 다른 번호를 입력하세요.")
                continue
                
            guessed.add(num)
            attempts += 1
            
            if num == target:
                print(f"\n🎉 [{num}]번 위치에서 보물을 찾았습니다! 🎉")
                print_numbered_lattice(guessed, target, reveal_target=True)
                print(f"최종 시도 횟수: {attempts}회\n")
                return
            
            dist = get_distance_3d(num, target)
            print(f"❌ 보물이 없습니다. (보물까지의 3D 맨해튼 거리: {dist})")
            
            x1, y1, z1 = get_3d_coords(num)
            x2, y2, z2 = get_3d_coords(target)
            if abs(x1 - x2) <= 1 and abs(y1 - y2) <= 1 and abs(z1 - z2) <= 1:
                print("💡 힌트: 보물이 인접해 있습니다! (체비쇼프 거리 1 이내)")
                
        except ValueError:
            print("숫자만 입력해주세요.")
            
    print(f"\n💀 기회를 모두 소진하였습니다. 정답 번호는 [{target}]번이었습니다.")
    print_numbered_lattice(guessed, target, reveal_target=True)

def main():
    while True:
        print("\n1. 3D 단일 번호 탐색 시작")
        print("9. 게임 종료")
        sel = input("선택? ")
        
        if sel == '1':
            play_game()
        elif sel == '9':
            print("프로그램을 종료합니다.")
            break
        else:
            print("잘못된 입력입니다.")

if __name__ == "__main__":
    main()