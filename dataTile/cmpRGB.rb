minZoom = 0
maxZoom = 4
z = minZoom
while z <= maxZoom
    Dir::chdir("#{z}")
    (2**z).times do |x|
        Dir::chdir("#{x}")
        (2**z).times do |y|
            system("convert #{y}.png tmp.txt")
            File.open("#{y}_pre.txt","w") do |fw|
                fw.puts("# ImageMagick pixel enumeration: 240,240,255,srgb")
                File.open("tmp.txt"){|f|
                  f.gets()
                  f.each_line{|line|
                    tmp = line.slice(line.index("#")+1,2)
                    r = Integer("0x#{tmp}")
                    tmp = line.slice(line.index("#")+3,2)
                    g = Integer("0x#{tmp}")
                    tmp = line.slice(line.index("#")+5,2)
                    b = Integer("0x#{tmp}")
                    line.gsub!(/\(.*/,"(#{r},#{g},#{b})")
                    fw.puts(line)
                  }
                }
            end
            puts "diff #{z}/#{x}/#{y}.txt #{z}/#{x}/#{y}_pre.txt"
            system("diff #{y}.txt #{y}_pre.txt")
        end
        x += 1
        #system("rm tmp.txt")
        Dir::chdir("..")
    end
    z += 1
    Dir::chdir("..")
end
